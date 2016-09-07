import Ember from 'ember';

var TicketDeserializer = Ember.Object.extend({
  setup_status(fk, ticket) {
    ticket.change_status(fk);
  },
  setup_cc(cc_json, ticket, store) {
    const existing_cc = ticket.get('cc');
    existing_cc.forEach((cc) => {
      ticket.remove_cc(cc.get('id'));
    });
    cc_json.forEach((cc) => {
      ticket.add_cc(cc);
      store.push('person', cc);
    });
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
    response.results.forEach((ticket) => {
      const pushed_ticket = store.push('ticket', ticket);
      pushed_ticket.save();
    });
  },
  _deserializeSingle(response) {
    let store = this.get('simpleStore');
    let cc_json = response.cc;
    delete response.cc;
    let ticket = store.push('ticket', response);
    this.setup_status(response.status_fk, ticket);
    this.setup_cc(cc_json, ticket, store);
    ticket.save();
    return ticket;
  },
});

export default TicketDeserializer;
