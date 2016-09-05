import registerWithContainer from 'ember-cli-auto-register/register';

export function initialize(application) {
  registerWithContainer('deserializers', application);
  application.inject('deserializers', 'simpleStore', 'service:simpleStore');
}

export default {
  name: 'deserializers',
  after: 'simple-store',
  initialize: initialize
};
