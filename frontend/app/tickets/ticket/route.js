import Ember from 'ember';
import inject from 'frontend/utilities/inject';

var TicketSingleRoute = Ember.Route.extend({
  repository: inject('ticket'),
  model(params) {
    const pk = params.ticket_id;
    const repository = this.get('repository');
    const statuses = this.get('simpleStore').find('ticket-status');
    return Ember.RSVP.hash({
      model: repository.findById(pk),
      statuses: statuses,
    });
  },
  setupController: function(controller, hash) {
    controller.setProperties(hash);
  },
});

export default TicketSingleRoute;
