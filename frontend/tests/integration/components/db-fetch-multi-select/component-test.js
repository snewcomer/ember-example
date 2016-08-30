import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('db-fetch-multi-select', 'Integration | Component | db fetch multi select', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{db-fetch-multi-select}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#db-fetch-multi-select}}
      template block text
    {{/db-fetch-multi-select}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
