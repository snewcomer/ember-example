import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    let store = this.get('simpleStore');
    const ticket_status_list = Ember.$('[data-preload-ticket-statuses]').data('configuration');
    ticket_status_list.forEach((model) => {
      store.push('ticket-status', model);
    });
  }
});
