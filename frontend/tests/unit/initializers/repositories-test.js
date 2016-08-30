import Ember from 'ember';
import RepositoriesInitializer from 'frontend/initializers/repositories';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | repositories', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RepositoriesInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
