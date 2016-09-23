import Ember from 'ember';
const { run } = Ember;
import { attr, Model } from 'ember-cli-simple-store/model';
import { validator, buildValidations } from 'ember-cp-validations';
import equal from 'frontend/utilities/equal';

const Validations = buildValidations({
  request: [
    validator('presence', {
      presence: true,
      message: 'errors.ticket.request'
    }),
    validator('length', {
      min: 5,
      message: 'errors.ticket.request.length',
    }),
  ],
});

var TicketModel = Model.extend(Validations, {
  simpleStore: Ember.inject.service(),
  // this is a simple store attr.  Putting quotes means the ticket model wont be dirty if user is on new template
  // and enters text but decides to back out.
  request: attr(''),
  
  /* START BELONGS_TO */

  status_fk: undefined,
  /* @method status
   * main reference for a ticket and its status
  */
  status: Ember.computed.alias('statuses.firstObject'),
  /* @method statuses
   * looks at tickets array on the ticket-status model to find a ticket's status
  */
  statuses: Ember.computed(function() {
    const filter = function(ticket_status) {
      const tickets = ticket_status.get('tickets') || [];
      return tickets.includes(this.get('id'));
    };
    return this.get('simpleStore').find('ticket-status', filter.bind(this));
  }),
  /* @method change_status
   * updates old and new ticket-status models' tickets array
  */
  change_status(id) {
    const store = this.get('simpleStore');
    run(() => {
      // old - remove ticket id from tickets array
      const old_status = this.get('status');
      if (old_status) {
        const tickets = old_status.get('tickets') || [];
        const updated_tickets_array = tickets.filter(id => id !== this.get('id') );
        store.push('ticket-status', {id: old_status.get('id'), tickets: updated_tickets_array});
      } 
      // new - add ticket id to tickets array
      const new_status = store.find('ticket-status', id);
      const new_status_tickets = new_status.get('tickets') || [];
      store.push('ticket-status', {id: id, tickets: new_status_tickets.concat(this.get('id'))});
    });
  },
  statusIsDirty: Ember.computed('status', 'status_fk', function() {
    const status = this.get('status');
    const fk = this.get('status_fk');
    if (status) {
      return status.get('id') === fk ? false : true;
    }
    if(!status && fk) {
      return true;
    }
  }),
  statusIsNotDirty: Ember.computed.not('statusIsDirty'),
  saveStatus() {
    const pk = this.get('id');
    const status = this.get('status');
    run(() => {
      this.get('simpleStore').push('ticket', { id: pk, 'status_fk': status ? status.get('id') : null });
    });
  },

  /* END BELONGS_TO */

  /* START M2M */

  ticket_cc_fks: [], // just a reference.  This is a problem however, b/c on prototype rather than instance.  Need to put in init
  /* @method cc
   * main reference for tickets and its cc's
  */
  cc: Ember.computed('ticket_cc.[]', function() {
    const many_related_models = this.get('ticket_cc');
    const filter = function(person_model) {
      const many_related_pks = this.mapBy('person_pk');
      return many_related_pks.includes(person_model.get('id'));
    };
    return this.get('simpleStore').find('person', filter.bind(many_related_models));
  }),
  cc_ids: Ember.computed.mapBy('cc', 'id'),
  ticket_cc: Ember.computed(function() {
    // simpleStore filter method refires when changes happen to store objects in ticket-join-person
    // which is awesome b/c we need this to refire when we add/remove cc with power select
    // so when this filter method refires and we get a new set of ticket_cc, the cc method above
    // also refires b/c it has a computed cache breaking property 'ticket_cc.[]'
    const filter = (m2m) => {
      return m2m.get('ticket_pk') === this.get('id') && !m2m.get('removed');
    };
    return this.get('simpleStore').find('ticket-join-person', filter);
  }),
  ticket_cc_ids: Ember.computed.mapBy('ticket_cc', 'id'),
  ccIsDirty: Ember.computed('ticket_cc_ids.[]', 'ticket_cc_fks.[]', function() {
    // ...cc_fks && ...cc_ids are used for dirty tracking.  ...cc_fks do not change when add/remove cc w/ power select
    const m2m_ids = this.get('ticket_cc_ids');
    const m2m_fks = this.get('ticket_cc_fks') || [];
    return equal(m2m_ids, m2m_fks) ? false : true;
  }),
  ccIsNotDirty: Ember.computed.not('ccIsDirty'),
  /* @method remove_cc
   * @param {uuid} pk - a person model pk from local join model cache
  */
  remove_cc(many_related_model_pk) {
    const store = this.get('simpleStore');
    const m2m_pk = this.get('ticket_cc').filter((m2m) => {
      return m2m.get('person_pk') === many_related_model_pk;
    }).objectAt(0).get('id');
    run(() => {
      // removed flag in ticket_cc method is how we ensure join models are not returned in the filter method
      store.push('ticket-join-person', {id: m2m_pk, removed: true});
    });
  },
  /* @method add_cc
   * @param {object} many_related_model - a person model added from database fetch in power select
   * adds person to simple store cache
   * adds join model to simple store cache
  */
  add_cc(many_related_model) {
    const store = this.get('simpleStore');

    // PERSON STORE OBJECT
    // if person not in store yet (fetched from db so plain JS object)
    let new_many_related = store.find('person', many_related_model.id);
    if(!new_many_related.get('content') || new_many_related.get('isNotDirtyOrRelatedNotDirty')){
      run(() => {
        new_many_related = store.push('person', many_related_model);
        // save ensures clean model (simple-store provides 'isDirty' property when field has changed)
        new_many_related.save();
      });
    }

    // M2M JOIN MODEL STORE OBJECT
    const many_related_pk = new_many_related.get('id');
    //find ONE existing join model and only get those that relate to this ticket and this person being added
    const existing_join = store.find('ticket-join-person').toArray();
    let existing = existing_join.filter((m2m) => {
      return m2m.get('person_pk') === many_related_pk && m2m.get('ticket_pk') === this.get('id');
    }).objectAt(0);
    //create join model b/w ticket and person_pk
    const new_join_model = {id: Ember.uuid()};
    new_join_model['ticket_pk'] = this.get('id');
    new_join_model['person_pk'] = many_related_pk;
    run(() => {
      if (existing) {
        // removed property is how we filter out the join models in ticket_cc, so make sure is available
        store.push('ticket-join-person', {id: existing.get('id'), removed: undefined});
      } else {
        store.push('ticket-join-person', new_join_model);
      }
    });
  },
  /* @method saveCC
   * updates ...cc_fks to match ...cc_ids array to ensure passes ccIsDirty check
  */
  saveCc() {
    // current ticket cc relationship data
    const many_relateds = this.get('ticket_cc');
    const many_relateds_ids = this.get('ticket_cc_ids') || [];
    const previous_m2m_fks = this.get('ticket_cc_fks') || [];
    //add fk to ...cc_fks if any of the current join models arent in the array
    let updated_m2m_fks = previous_m2m_fks;
    many_relateds.forEach((join_model) => {
      // if we added a cc, however, our fk array doesnt have it, then add to it
      if(!previous_m2m_fks.includes(join_model.get('id'))) {
        run(() => {
          updated_m2m_fks = updated_m2m_fks.concat(join_model.get('id'));
          this.get('simpleStore').push('ticket', {id: this.get('id'), 'ticket_cc_fks': updated_m2m_fks});
        });
      }
    });
    //remove fk from ..cc_fks if not in current ...cc_ids array...no idea why using for loop :)
    const updated_previous_m2m_fks = this.get('ticket_cc_fks');
    for (let i=previous_m2m_fks.length-1; i>=0; --i) {
      if (!many_relateds_ids.includes(previous_m2m_fks[i])) {
        updated_previous_m2m_fks.removeObject(previous_m2m_fks[i]);
        this.get('simpleStore').push('ticket', {id: this.get('id'), 'ticket_cc_fks': updated_previous_m2m_fks});
      }
    }
  },

  /* END M2M */

  /* @method isDirtyOrRelatedDirty
   * overall tracker of ticket and related models
   * method is used to determine if user can navigate away from page
  */
  isDirtyOrRelatedDirty: Ember.computed('isDirty', 'statusIsDirty', 'ccIsDirty', function() {
    return this.get('isDirty') || this.get('statusIsDirty') || this.get('ccIsDirty');
  }),
  isNotDirtyOrRelatedNotDirty: Ember.computed.not('isDirtyOrRelatedDirty'),

  /* @method serialize
   * Sent to Django
  */
  serialize() {
    let payload = {
      id: this.get('id'),
      request: this.get('request'),
      status: this.get('status.id'),
      // assignee: this.get('assignee.id'),
      cc: this.get('cc_ids'),
    };
    return payload;
  },
  /* @method saveRelated
   * updates related models dirty tracking attributes
  */
  saveRelated() {
    this.saveStatus();
    this.saveCc();
  },
});

export default TicketModel;
