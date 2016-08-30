import Ember from 'ember';
import inject from 'frontend/utilities/inject';
//start-non-standard
import computed from 'ember-computed-decorators';
//end-non-standard

var TicketSingleRoute = Ember.Route.extend({
  repository: inject('ticket'),
  model(params, transition) {
    const pk = params.ticket_id;
    const repository = this.get('repository');
    let ticket = repository.fetch(pk);
    const statuses = this.get('statuses');
    return Ember.RSVP.hash({
      model: this.get('repository').findById(pk),
      statuses: statuses,
    });
  },
  setupController: function(controller, hash) {
    controller.setProperties(hash);
  },
});

export default TicketSingleRoute;
