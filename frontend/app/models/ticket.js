import Ember from 'ember';
const { run } = Ember;
import { attr, Model } from 'ember-cli-simple-store/model';
import inject from 'frontend/utilities/store';
import { validator, buildValidations } from 'ember-cp-validations';

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
    }
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
  assignee_fk: undefined,
  ticket_cc_fks: [],
  isDirtyOrRelatedDirty: Ember.computed('isDirty', 'assigneeIsDirty', 'statusIsDirty', 'ccIsDirty', function() {
    return this.get('isDirty') || this.get('assigneeIsDirty') || this.get('statusIsDirty') || this.get('ccIsDirty');
  }),
  isNotDirtyOrRelatedNotDirty: Ember.computed.not('isDirtyOrRelatedDirty'),
  serialize() {
    let payload = {
      id: this.get('id'),
      request: this.get('request'),
      status: this.get('status.id'),
      assignee: this.get('assignee.id'),
      cc: this.get('cc_ids'),
    };
    return payload;
  },
  // rollback() {
  //   this.rollbackStatus();
  //   this.rollbackAssignee();
  //   this.rollbackCc();
  //   this._super(...arguments);
  // },
  saveRelated() {
    this.saveStatus();
    // this.saveAssignee();
    // this.saveCc();
  },
});

export default TicketModel;
