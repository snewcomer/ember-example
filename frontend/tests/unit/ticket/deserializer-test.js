import Ember from 'ember';
const { run } = Ember;
import {test, module} from 'frontend/tests/helpers/qunit';
import module_registry from 'frontend/tests/helpers/module_registry';
import TD from 'frontend/vendor/defaults/ticket';
import TF from 'frontend/vendor/ticket_fixtures';
import PD from 'frontend/vendor/defaults/person';
import TPD from 'frontend/vendor/defaults/ticket-join-person';
import TicketDeserializer from 'frontend/deserializers/ticket';

var store, ticket, subject;

module('Unit | Deserializer | ticket', {
  beforeEach() {
    store = module_registry(this.container, this.registry, ['model:ticket', 'model:person', 'model:ticket-status', 'model:ticket-join-person']);
    subject = TicketDeserializer.create({simpleStore: store});
    run(() => {
      ticket = store.push('ticket', {id: TD.idOne, status_fk: TD.statusOneId});
      store.push('ticket-status', {id: TD.statusOneId, tickets: [TD.idOne]});
      store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idOne});
      store.push('person', {id: PD.idOne, fullname: 'Terrance'});
    });
  }
});

// STATUS
test('ticket is correctly deserialized if simple store has same data', (assert) => {
  const json = TF.generate(TD.idOne);
  run(() => {
    subject.deserialize(json, json.id);
  });
  ticket = store.find('ticket', TD.idOne);
  assert.equal(ticket.get('request'), TD.requestOne);
  assert.equal(ticket.get('status_fk'), TD.statusOneId);
  assert.equal(ticket.get('status').get('id'), TD.statusOneId);
  assert.deepEqual(ticket.get('status').get('tickets'), [TD.idOne]);
  const status = store.find('ticket-status', TD.statusOneId);
  assert.deepEqual(status.get('tickets'), [TD.idOne]);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idOne]);
});

test('ticket is correctly deserialized if simple store has diff data', (assert) => {
  const json = TF.generate(TD.idOne);
  json.status_fk = TD.statusTwoId;
  json.request = 'wat';
  run(() => {
    subject.deserialize(json, json.id);
  });
  ticket = store.find('ticket', TD.idOne);
  assert.equal(ticket.get('request'), 'wat');
  assert.equal(ticket.get('status_fk'), TD.statusTwoId);
  assert.equal(ticket.get('status').get('id'), TD.statusTwoId);
  assert.deepEqual(ticket.get('status').get('tickets'), [TD.idOne]);
  const status = store.find('ticket-status', TD.statusOneId);
  assert.deepEqual(status.get('tickets'), []);
  const status_two = store.find('ticket-status', TD.statusTwoId);
  assert.deepEqual(status_two.get('tickets'), [TD.idOne]);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idOne]);
});

// CC
test('ticket is correctly deserialized w/ cc if simple store has same data', (assert) => {
  const json = TF.generate(TD.idOne);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.idOne);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idOne]);
  run(() => {
    subject.deserialize(json, json.id);
  });
  ticket = store.find('ticket', TD.idOne);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.idOne);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idOne]);
});

test('ticket is correctly deserialized w/ cc if simple store has diff data', (assert) => {
  const json = TF.generate(TD.idOne);
  json.cc[0].id = PD.idTwo;
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.idOne);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idOne]);
  run(() => {
    subject.deserialize(json, json.id);
  });
  ticket = store.find('ticket', TD.idOne);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.idTwo);
  assert.deepEqual(ticket.get('cc').mapBy('id'), [PD.idTwo]);
});
