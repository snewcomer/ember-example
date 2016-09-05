import Ember from 'ember';
const { run } = Ember;
import { attr, Model } from 'ember-cli-simple-store/model';
// import inject from 'frontend/utilities/store';
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
  request: attr(''),
  status_fk: undefined,
  status: Ember.computed.alias('statuses.firstObject'),
  statuses: Ember.computed(function() {
    const filter = function(ticket_status) {
      const tickets = ticket_status.get('tickets') || [];
      return tickets.includes(this.get('id'));
    };
    return this.get('simpleStore').find('ticket-status', filter.bind(this));
  }),
  change_status(id) {
    const store = this.get('simpleStore');
    const old_status = this.get('status');
    let tickets = [];
    if (old_status) {
      tickets = old_status.get('tickets');
    }
    const new_status = store.find('ticket-status', id);
    const updated_tickets_array = tickets.filter(id => id !== this.get('id') );
    run(() => {
      if (old_status) {
        store.push('ticket-status', {id: old_status.get('id'), tickets: updated_tickets_array});
      }
      store.push('ticket-status', {id: id, tickets: new_status.get('tickets').concat(this.get('id'))});
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
      this.get('simpleStore').push('ticket', { id: pk, 'tickets': status ? status.get('id') : null });
    });
  },
  // assignee_fk: undefined,
  ticket_cc_fks: [],
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
    const filter = (m2m) => {
      return m2m.get('ticket_pk') === this.get('id') && !m2m.get('removed');
    };
    return this.get('simpleStore').find('ticket-join-person', filter);
  }),
  ticket_cc_ids: Ember.computed.mapBy('ticket_cc', 'id'),
  ccIsDirty: Ember.computed('ticket_cc_ids.[]', 'ticket_cc_fks.[]', function() {
    const m2m_ids = this.get('ticket_cc_ids');
    const m2m_fks = this.get('ticket_cc_fks') || [];
    return equal(m2m_ids, m2m_fks) ? false : true;
  }),
  ccIsNotDirty: Ember.computed.not('ccIsDirty'),
  isDirtyOrRelatedDirty: Ember.computed('isDirty', 'statusIsDirty', 'ccIsDirty', function() {
    return this.get('isDirty') || this.get('statusIsDirty') || this.get('ccIsDirty');
  }),
  remove_cc(many_related_model_pk) {
    const store = this.get('simpleStore');
    const m2m_pk = this.get('ticket_cc').filter((m2m) => {
      return m2m.get('person_pk') === many_related_model_pk;
    }).objectAt(0).get('id');
    run(() => {
      store.push('ticket-join-person', {id: m2m_pk, removed: true});
    });
  },
  add_cc(many_related_model) {
    const many_fk = 'person_pk';
    const main_many_fk = 'ticket_pk';
    const store = this.get('simpleStore');
    let new_many_related = store.find('person', many_related_model.id);
    if(!new_many_related.get('content') || new_many_related.get('isNotDirtyOrRelatedNotDirty')){
      run(() => {
        new_many_related = store.push('person', many_related_model);
        /* jshint ignore:start */
        // new_many_related might be an Ember object
        new_many_related.save && new_many_related.save();
        /* jshint ignore:end */
      });
    }
    const many_related_pk = new_many_related.get('id');
    //check for existing
    const existing_join = store.find('ticket-join-person').toArray();
    let existing = existing_join.filter((m2m) => {
      return m2m.get(many_fk) === many_related_pk && m2m.get(main_many_fk) === this.get('id');
    }).objectAt(0);
    const new_join_model = {id: Ember.uuid()};
    new_join_model[main_many_fk] = this.get('id');
    new_join_model[many_fk] = many_related_pk;
    let new_model;
    run(() => {
      if(existing){
        new_model = store.push('ticket-join-person', {id: existing.get('id'), removed: undefined});
      } else{
        new_model = store.push('ticket-join-person', new_join_model);
      }
    });
    return new_model;
  },
  saveCc() {
    const m2m_models_ids = 'ticket_cc_ids';
    const m2m_models_fks = 'ticket_cc_fks';
    const id = this.get('id');
    const many_relateds = this.get('ticket_cc');
    const many_relateds_ids = this.get(m2m_models_ids) || [];
    const previous_m2m_fks = this.get(m2m_models_fks) || [];
    //add
    let updated_m2m_fks = previous_m2m_fks;
    many_relateds.forEach((join_model) => {
      if(!previous_m2m_fks.includes(join_model.get('id'))) {
        run(() => {
          updated_m2m_fks = updated_m2m_fks.concat(join_model.get('id'));
          let new_model;
          run(() => {
            new_model = this.get('simpleStore').push('ticket', {id: id, m2m_models_fks: updated_m2m_fks});
          });
          new_model.set(m2m_models_fks, updated_m2m_fks);
        });
      }
    });
    const updated_previous_m2m_fks = this.get(m2m_models_fks);
    //remove
    for (let i=previous_m2m_fks.length-1; i>=0; --i) {
      if (!many_relateds_ids.includes(previous_m2m_fks[i])) {
        updated_previous_m2m_fks.removeObject(previous_m2m_fks[i]);
      }
    }
  },
  isNotDirtyOrRelatedNotDirty: Ember.computed.not('isDirtyOrRelatedDirty'),
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
  saveRelated() {
    this.saveStatus();
    // this.saveAssignee();
    this.saveCc();
  },
});

export default TicketModel;
