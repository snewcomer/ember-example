import { create, visitable, text } from 'ember-cli-page-object';
import TD from 'frontend/vendor/defaults/ticket';
import BASEURLS, { TICKET_LIST_URL } from 'frontend/utilities/urls';

const BASE_URL = BASEURLS.base_tickets_url;
const DETAIL_URL = BASE_URL + '/' + TD.idOne;

export default create({
  visit: visitable(TICKET_LIST_URL),
  visitDetail: visitable(DETAIL_URL),
  statusSelected: text('.t-status-select'),
  ccSelectedOne: text('.t-cc-select .ember-power-select-multiple-option:eq(0)'),
  ccSelectedTwo: text('.t-cc-select .ember-power-select-multiple-option:eq(1)'),
});
