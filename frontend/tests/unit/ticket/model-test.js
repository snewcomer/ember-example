import Ember from 'ember';
const { run } = Ember;
import {test, module} from 'frontend/tests/helpers/qunit';
import module_registry from 'frontend/tests/helpers/module_registry';
import TD from 'frontend/vendor/defaults/ticket';
import PD from 'frontend/vendor/defaults/person';
import TPD from 'frontend/vendor/defaults/ticket-join-person';

var store, ticket;

module('Unit | Model | ticket', {
  beforeEach() {
    store = module_registry(this.container, this.registry, ['model:ticket', 'model:person', 'model:ticket-status', 'model:ticket-join-person']);
  }
});

test('ticket request field is dirty trackable', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne});
  ticket.set('request', 'wat');
  assert.ok(ticket.get('isDirty'));
});

test('ticket request field is not dirty with empty string and no existing', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne});
  ticket.set('request', 'wat');
  ticket.set('request', '');
  assert.ok(ticket.get('isNotDirty'));
});

/*TICKET TO STATUS*/
test('ticket is dirty or related is dirty when existing status is altered', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, status_fk: TD.statusOneId});
  store.push('ticket-status', {id: TD.statusOneId, name: TD.statusOne, tickets: [TD.idOne]});
  store.push('ticket-status', {id: TD.statusTwoId, name: TD.statusTwo, tickets: []});
  assert.equal(ticket.get('status.id'), TD.statusOneId);
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  assert.ok(ticket.get('statusIsNotDirty'));
  ticket.change_status(TD.statusTwoId);
  assert.equal(ticket.get('status.id'), TD.statusTwoId);
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  assert.ok(ticket.get('statusIsDirty'));
});

test('ticket is dirty or related is dirty when existing status is altered (starting w/ nothing)', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, status_fk: undefined});
  store.push('ticket-status', {id: TD.statusTwoId, name: TD.statusTwo, tickets: []});
  assert.equal(ticket.get('status'), undefined);
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  ticket.change_status(TD.statusTwoId);
  assert.equal(ticket.get('status.id'), TD.statusTwoId);
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
});

test('change_status will append the ticket id to the new status tickets array', function(assert) {
  ticket = store.push('ticket', {id: TD.idOne});
  let status = store.push('ticket-status', {id: TD.statusOneId, name: TD.statusOne, tickets: [9]});
  ticket.change_status(TD.statusOneId);
  assert.deepEqual(status.get('tickets'), [9, TD.idOne]);
});

test('status will save correctly when changed starting with undefined', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, status_fk: undefined});
  store.push('ticket-status', {id: TD.statusOneId, name: TD.statusOne, tickets: []});
  assert.equal(ticket.get('status_fk'), undefined);
  assert.equal(ticket.get('status.id'), undefined);
  ticket.change_status(TD.statusOneId);
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  assert.equal(ticket.get('status.id'), TD.statusOneId);
  assert.equal(ticket.get('status_fk'), undefined);
  ticket.saveRelated();
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  assert.equal(ticket.get('status.id'), TD.statusOneId);
  assert.equal(ticket.get('status_fk'), TD.statusOneId);
});

test('status will save correctly when changed starting with a status', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, status_fk: TD.statusTwoId});
  store.push('ticket-status', {id: TD.statusOneId, name: TD.statusOne, tickets: []});
  store.push('ticket-status', {id: TD.statusTwoId, name: TD.statusTwo, tickets: [TD.idOne]});
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  assert.equal(ticket.get('status.id'), TD.statusTwoId);
  assert.equal(ticket.get('status_fk'), TD.statusTwoId);
  ticket.change_status(TD.statusOneId);
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  assert.equal(ticket.get('status.id'), TD.statusOneId);
  assert.equal(ticket.get('status_fk'), TD.statusTwoId);
  ticket.saveRelated();
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  assert.equal(ticket.get('status.id'), TD.statusOneId);
  assert.equal(ticket.get('status_fk'), TD.statusOneId);
});

test('status will save correctly as undefined', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, status_fk: undefined});
  store.push('ticket-status', {id: TD.statusOneId, name: TD.statusOne, tickets: []});
  ticket.saveRelated();
  assert.equal(ticket.get('status_fk'), undefined);
  assert.equal(ticket.get('status.id'), undefined);
});

/*TICKET TO CC*/
test('cc property should return all associated cc or empty array', (assert) => {
  let m2m = store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  store.push('person', {id: PD.idOne});
  let cc = ticket.get('cc');
  assert.equal(cc.get('length'), 1);
  assert.equal(cc.objectAt(0).get('id'), PD.idOne);
  run(function() {
    store.push('ticket-join-person', {id: m2m.get('id'), removed: true});
  });
  assert.equal(ticket.get('cc').get('length'), 0);
});

test('cc property is not dirty when no cc present (undefined)', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: undefined});
  store.push('person', {id: PD.idOne});
  assert.equal(ticket.get('cc').get('length'), 0);
  assert.ok(ticket.get('ccIsNotDirty'));
});

test('cc property is not dirty when no cc present (empty array)', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: []});
  store.push('person', {id: PD.idOne});
  assert.equal(ticket.get('cc').get('length'), 0);
  assert.ok(ticket.get('ccIsNotDirty'));
});

test('cc property is not dirty when attr on person is changed', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idOne});
  let person = store.push('person', {id: PD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('ccIsNotDirty'));
  run(function() {
    store.push('person', {id: PD.idOne, first_name: PD.first_name});
  });
  assert.ok(person.get('isDirty'));
  assert.ok(ticket.get('ccIsNotDirty'));
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('first_name'), PD.first_name);
});

test('removing a ticket-join-person will mark the ticket as dirty and reduce the associated cc models to zero', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idOne});
  store.push('person', {id: PD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('ccIsNotDirty'));
  ticket.remove_cc(PD.id);
  assert.ok(ticket.get('ccIsDirty'));
  assert.equal(ticket.get('cc').get('length'), 0);
});

test('replacing a ticket-join-person with some other ticket-join-person still shows the ticket model as dirty', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idOne});
  store.push('person', {id: PD.idOne});
  const person_two = {id: PD.idTwo};
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('ccIsNotDirty'));
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  ticket.remove_cc(PD.id);
  assert.ok(ticket.get('ccIsDirty'));
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  assert.equal(ticket.get('cc').get('length'), 0);
  ticket.add_cc(person_two);
  assert.ok(ticket.get('ccIsDirty'));
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.idTwo);
});

test('cc property only returns the single matching item even when multiple people (cc) exist', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idTwo});
  const person_two = {id: PD.idTwo};
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  ticket.add_cc(person_two);
  let cc = ticket.get('cc');
  assert.equal(cc.get('length'), 1);
  assert.equal(cc.objectAt(0).get('id'), PD.idTwo);
});

test('cc property returns multiple matching items when multiple people (cc) exist', (assert) => {
  store.push('person', {id: PD.idOne});
  store.push('person', {id: PD.idTwo});
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idTwo, ticket_pk: TD.idOne});
  store.push('ticket-join-person', {id: TPD.idTwo, person_pk: PD.idOne, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne, TPD.idTwo]});
  let cc = ticket.get('cc');
  assert.equal(cc.get('length'), 2);
  assert.equal(cc.objectAt(0).get('id'), PD.id);
  assert.equal(cc.objectAt(1).get('id'), PD.idTwo);
});

test('cc property will update when the m2m array suddenly has the person pk (starting w/ empty array)', (assert) => {
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: []});
  let person = {id: PD.idOne};
  assert.equal(ticket.get('cc').get('length'), 0);
  assert.ok(ticket.get('ccIsNotDirty'));
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  ticket.add_cc(person);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.id);
  assert.ok(ticket.get('ccIsDirty'));
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
});

test('cc property will update when the m2m array suddenly has the person pk', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idOne, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  store.push('person', {id: PD.idOne});
  let person_two = {id: PD.idTwo};
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('ccIsNotDirty'));
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
  ticket.add_cc(person_two);
  assert.equal(ticket.get('cc').get('length'), 2);
  assert.equal(ticket.get('cc').objectAt(0).get('id'), PD.id);
  assert.equal(ticket.get('cc').objectAt(1).get('id'), PD.idTwo);
  assert.ok(ticket.get('ccIsDirty'));
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
});

test('cc property will update when the m2m array suddenly removes the person', (assert) => {
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idOne, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne]});
  store.push('person', {id: PD.idOne});
  assert.equal(ticket.get('cc').get('length'), 1);
  ticket.remove_cc(PD.id);
  assert.equal(ticket.get('cc').get('length'), 0);
});

test('add_cc will add back old join model after it was removed and dirty the model (multiple)', (assert) => {
  const ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne, TPD.idTwo]});
  store.push('person', {id: PD.idTwo});
  const person_three = store.push('person', {id: PD.idThree});
  store.push('ticket-join-person', {id: TPD.idOne, ticket_pk: TD.idOne, person_pk: PD.idTwo});
  store.push('ticket-join-person', {id: TPD.idTwo, ticket_pk: TD.idOne, person_pk: PD.idThree});
  ticket.remove_cc(person_three.get('id'));
  assert.equal(ticket.get('cc').get('length'), 1);
  ticket.add_cc({id: PD.idThree});
  assert.equal(ticket.get('cc').get('length'), 2);
  assert.ok(ticket.get('ccIsNotDirty'));
});

test('save ensures m2m relationship is not dirty', (assert) => {
  store.push('person', {id: PD.idOne});
  store.push('person', {id: PD.idTwo});
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idOne, ticket_pk: TD.idOne});
  store.push('ticket-join-person', {id: TPD.idTwo, person_pk: PD.idTwo, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne, TPD.idTwo]});
  assert.equal(ticket.get('cc').get('length'), 2);
  ticket.remove_cc(PD.id);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('ccIsDirty'));
  assert.ok(ticket.get('isDirtyOrRelatedDirty'));
  ticket.save();
  ticket.saveRelated();
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.ok(ticket.get('isNotDirty'));
  assert.ok(ticket.get('ccIsNotDirty'));
  assert.ok(ticket.get('isNotDirtyOrRelatedNotDirty'));
});

test('cc_ids computed returns a flat list of ids for each person', (assert) => {
  store.push('person', {id: PD.idOne});
  store.push('person', {id: PD.idTwo});
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idOne, ticket_pk: TD.idOne});
  store.push('ticket-join-person', {id: TPD.idTwo, person_pk: PD.idTwo, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne, TPD.idTwo]});
  assert.equal(ticket.get('cc').get('length'), 2);
  assert.deepEqual(ticket.get('cc_ids'), [PD.idOne, PD.idTwo]);
  ticket.remove_cc(PD.id);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.deepEqual(ticket.get('cc_ids'), [PD.idTwo]);
});

test('ticket_cc_ids computed returns a flat list of ids for each person', (assert) => {
  store.push('person', {id: PD.idOne});
  store.push('person', {id: PD.idTwo});
  store.push('ticket-join-person', {id: TPD.idOne, person_pk: PD.idOne, ticket_pk: TD.idOne});
  store.push('ticket-join-person', {id: TPD.idTwo, person_pk: PD.idTwo, ticket_pk: TD.idOne});
  ticket = store.push('ticket', {id: TD.idOne, ticket_cc_fks: [TPD.idOne, TPD.idTwo]});
  assert.equal(ticket.get('cc').get('length'), 2);
  assert.deepEqual(ticket.get('ticket_cc_ids'), [TPD.idOne, TPD.idTwo]);
  ticket.remove_cc(PD.id);
  assert.equal(ticket.get('cc').get('length'), 1);
  assert.deepEqual(ticket.get('ticket_cc_ids'), [TPD.idTwo]);
});
