import { test } from 'qunit';
import moduleForAcceptance from 'frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | ticket detail');

test('visiting /ticket-detail', function(assert) {
  visit('/tickets');

  andThen(function() {
    assert.equal(currentURL(), '/tickets');
  });
});
