import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('db-fetch-select', 'Integration | Component | db fetch select', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{db-fetch-select}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#db-fetch-select}}
      template block text
    {{/db-fetch-select}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
