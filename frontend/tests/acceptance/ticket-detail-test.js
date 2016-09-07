import { test } from 'qunit';
import { xhr, clearxhr } from 'frontend/tests/helpers/xhr';
import moduleForAcceptance from 'frontend/tests/helpers/module-for-acceptance';
import page from 'frontend/tests/pages/ticket';
import TD from 'frontend/vendor/defaults/ticket';
import TF from 'frontend/vendor/ticket_fixtures';
import PF from 'frontend/vendor/person_fixtures';
import BASEURLS, { TICKETS_URL, TICKET_LIST_URL, PEOPLE_URL } from 'frontend/utilities/urls';

const BASE_URL = BASEURLS.base_tickets_url;
const DETAIL_URL = `${BASE_URL}/${TD.idOne}`;

let list_xhr, detail_xhr;

moduleForAcceptance('Acceptance | ticket detail', {
  beforeEach() {
    list_xhr = xhr(`${TICKETS_URL}`, 'GET', null, {}, 200, TF.list());
    detail_xhr = xhr(`${TICKETS_URL}${TD.idOne}/`, 'GET', null, {}, 200, TF.detail());
  }
});

test('visiting /ticket-detail and can select a status', function(assert) {
  page.visitDetail();
  andThen(() => {
    assert.equal(currentURL(), DETAIL_URL);
    assert.equal(page.statusSelected, 'ticket.status.new');
  });
  selectChoose('.t-status-select', 'ticket.status.draft');
  andThen(() => {
    assert.equal(page.statusSelected, 'ticket.status.draft');
  });
});

test('can add and remove cc', function(assert) {
  page.visitDetail();
  andThen(() => {
    assert.equal(currentURL(), DETAIL_URL);
    assert.equal(page.ccSelectedOne.replace(/[\W]+/, ''), 'Mel1 Gibson1');
  });
  xhr(`${PEOPLE_URL}person__icontains=2/`, 'GET', null, {}, 200, PF.list());
  selectSearch('.t-cc-select', '2');
  selectChoose('.t-cc-select', 'Mel2 Gibson2');
  andThen(() => {
    assert.equal(page.ccSelectedOne.replace(/[\W]+/, ''), 'Mel1 Gibson1');
    assert.equal(page.ccSelectedTwo.replace(/[\W]+/, ''), 'Mel2 Gibson2');
  });
});

test('visit list and doesnt fire off detail xhr', assert => {
  // to show clearxhr functionality
  clearxhr(detail_xhr);
  page.visit();
  andThen(() => {
    assert.equal(currentURL(), TICKET_LIST_URL);
  });
});
