import Ember from 'ember';
import StoreInitializer from 'frontend/initializers/store';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | store', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  StoreInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
