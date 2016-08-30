import Store from 'ember-cli-simple-store/store';

export function initialize(application) {
  application.register('service:simpleStore', Store);
  application.inject('controller', 'simpleStore', 'service:simpleStore');
  application.inject('route', 'simpleStore', 'service:simpleStore');
}

export default {
  name: 'simple-store',
  initialize: initialize
};
