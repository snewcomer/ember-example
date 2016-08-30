import Ember from 'ember';
import config from 'frontend/config/environment';
import { task, timeout } from 'ember-concurrency';
const { computed, defineProperty } = Ember;

const DEBOUNCE_MS = config.APP.POWER_SELECT_DEBOUNCE;

var DBFetch = Ember.Component.extend({
  searchRepo: task(function * (search) {
    if (Ember.isBlank(search)) { return []; }
    yield timeout(DEBOUNCE_MS);
    const repo = this.get('repository');
    const searchRepo = this.get('searchMethod');
    const json = yield repo[searchRepo](search);
    return json;
  }).restartable(),
  init() {
    this._super(...arguments);
    const valuePath = this.get('valuePath');
    defineProperty(this, 'attributeValidation', computed.oneWay(`model.validations.attrs.${valuePath}`));
  },
  showMessage: computed('attributeValidation.isDirty', 'isInvalid', 'didValidate', function() {
    return (this.get('attributeValidation.isDirty') || this.get('didValidate')) && this.get('isInvalid');
  }),
  isValid: computed.oneWay('attributeValidation.isValid'),
  isInvalid: computed.oneWay('attributeValidation.isInvalid'),
  actions: {
    selected(item) {
      const model = this.get('model');
      const change_func = this.get('change_func');
      const remove_func = this.get('remove_func');
      if (item) {
        model[change_func](item);
      } else {
        model[remove_func]();
      }
    }
  }
});

export default DBFetch;

