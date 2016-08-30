export function initialize(appInstance) {
    window.__container__ = appInstance.__container__;
}

export default {
  name: 'lookup',
  initialize
};
