import Ember from 'ember';
import config from 'frontend/config/environment';
import { task, timeout } from 'ember-concurrency';
import inject from 'frontend/utilities/inject';

const DEBOUNCE_MS = config.APP.POWER_SELECT_DEBOUNCE;

export default Ember.Controller.extend({
  repository: inject('ticket'),
  searchRepo: task(function * (search) {
    if (Ember.isBlank(search)) { return []; }
    // ensure we arent firing off queries all the time
    yield timeout(DEBOUNCE_MS);
    const repository = this.get('repository');
    const json = yield repository['findPeople'](search);
    return json;
  }).restartable(),
  actions: {
    changeStatus(model, status) {
      model.change_status(status.get('id'));
    },
    changeCC(new_selection) {
      // power select passes the array of cc's including the one you just selected
      const model = this.get('model');
      const old_selection = model.get('cc');
      const old_selection_ids = model.get('cc_ids');
      const new_selection_ids = new_selection.mapBy('id');
      new_selection.forEach((new_model) => {
        if(!old_selection_ids.includes(new_model.id)) {
          model.add_cc(new_model);
        }
      });
      old_selection.forEach((old_model) => {
        /* if new selection does not contain old id, then remove */
        if (!new_selection_ids.includes(old_model.get('id'))) {
          model.remove_cc(old_model.get('id'));
        }
      });
    }
  }
});
