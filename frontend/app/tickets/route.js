import Ember from 'ember';
import inject from 'frontend/utilities/inject';

export default Ember.Route.extend({
  repository: inject('grid'),
  model() {
    const repository = this.get('repository');
    // xhr
    repository.find();
    return Ember.RSVP.hash({
      model: this.get('simpleStore').find('ticket')
    });
  },
  setupController: function(controller, hash) {
    controller.setProperties(hash);
  },
});
