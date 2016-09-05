import Ember from 'ember';

var TicketDeserializer = Ember.Object.extend({
  setup_status(fk, ticket) {
    let store = this.get('simpleStore');
    const ticket_status = store.find('ticket-status', fk);
    store.push('ticket-status', { id: ticket.get('id'), tickets: ticket_status.get('tickets').concat(ticket.get('id')) });
  },
  deserialize(response, id) {
    if (id) {
      return this._deserializeSingle(response);
    } else {
      return this._deserializeList(response);
    }
  },
  _deserializeList(response) {
    let store = this.get('simpleStore');
    response.forEach((ticket) => {
      store.push('ticket', ticket);
    });
  },
  _deserializeSingle(response) {
    let store = this.get('simpleStore');
    // let cc_json = response.cc;
    // delete response.cc;
    // let assignee_json = response.assignee;
    // response.assignee_fk = response.assignee ? response.assignee.id : undefined;
    // delete response.assignee;
    let ticket = store.push('ticket', response);
    this.setup_status(response.status_fk, ticket);
    // this.setup_assignee(assignee_json, ticket);
    // this.setup_cc(cc_json, ticket);
    ticket.save();
    return ticket;
  },
});

export default TicketDeserializer;
