import Ember from 'ember';
import inject from 'frontend/utilities/inject';

export default Ember.Route.extend({
  repository: inject('grid'),
  model() {
    const repository = this.get('repository');
    return repository.find();
  },
  setupController: function(controller, hash) {
    controller.setProperties(hash);
  },
});
