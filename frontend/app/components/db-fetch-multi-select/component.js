import Ember from 'ember';
import config from 'frontend/config/environment';

const DEBOUNCE_MS = config.APP.POWER_SELECT_DEBOUNCE;

var DBFetch = Ember.Component.extend({
  searchRepo: task(function * (search) {
    if (Ember.isBlank(search)) { return []; }
    yield timeout(DEBOUNCE_MS);
    const { repository, searchMethod, extra_params } = this.getProperties('repository', 'searchMethod', 'extra_params');
    const json = yield repository[searchMethod](search, extra_params);
    return json;
  }).restartable(),
  actions: {
    selected(new_selection) {
      const { model, multiAttr, multiAttrIds, add_func, remove_func } = this.getProperties('model', 'multiAttr', 'multiAttrIds', 'add_func', 'remove_func');
      const old_selection = model.get(multiAttr);
      const old_selection_ids = model.get(multiAttrIds);
      const new_selection_ids = new_selection.mapBy('id');
      new_selection.forEach((new_model) => {
        if(!old_selection_ids.includes(new_model.id)) {
          model[add_func](new_model);
        }
      });
      old_selection.forEach((old_model) => {
        /* if new selection does not contain old id, then remove */
        if (!new_selection_ids.includes(old_model.get('id'))) {
          model[remove_func](old_model.get('id'));
        }
      });
    }
  }
});

export default DBFetch;
