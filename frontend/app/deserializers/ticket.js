import Ember from 'ember';
const { run } = Ember;

var TicketDeserializer = Ember.Object.extend(OptConf, {
  deserialize(response, id) {
    return this._deserializeSingle(response);
  },
  _deserializeSingle(response) {
    let store = this.get('simpleStore');
    let cc_json = response.cc;
    delete response.cc;
    let assignee_json = response.assignee;
    response.assignee_fk = response.assignee ? response.assignee.id : undefined;
    delete response.assignee;
    let ticket = store.push('ticket', response);
    this.setup_status(response.status_fk, ticket);
    this.setup_assignee(assignee_json, ticket);
    this.setup_cc(cc_json, ticket);
    ticket.save();
    return ticket;
  },
});

export default TicketDeserializer;
