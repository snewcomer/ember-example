import { test } from 'qunit';
import moduleForAcceptance from 'frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | ipo detail');

test('visiting /ipo-detail', function(assert) {
  visit('/ipo-detail');

  andThen(function() {
    assert.equal(currentURL(), '/ipo-detail');
  });
});
