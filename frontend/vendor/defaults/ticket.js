var BSRS_TICKET_DEFAULTS_OBJECT = (function() {
  var factory = function() {
  };
  factory.prototype.defaults = function() {
    return {
      idOne: 'bf2b9c85-f6bd-4345-9834-c5d51de53d01',
      idTwo: '6ff90fb2-17ca-434d-9943-4035ea386b13',
      requestOne: 'working',
      statusZeroId: 'dfa1f64f-d0d7-4915-be85-54b8c38d3aeb',
      statusOneId: '5ab9b1fb-c624-4214-bb4c-16567b3d37e6',
      statusOne: 'New',
      statusOneKey: 'ticket.status.new',
      statusTwoId: 'e30f3033-ae2a-4af6-9d3a-ea7c98056c1d',
      statusTwo: 'Deferred',
      statusTwoKey: 'ticket.status.deferred',
      assigneeOneId: 'c05f20b0-cf6b-4650-a188-2e376d12f116',
      assigneeOne: 'Random1',
      assigneeTwoId: 'c05f20b0-cf6b-4650-a188-2e376d12f117',
      assigneeTwo: 'Random2',
    };
  };
  return factory;
})();

if (typeof window === 'undefined') {
  module.exports = new BSRS_TICKET_DEFAULTS_OBJECT().defaults();
} else {
  define('frontend/vendor/defaults/ticket', ['exports'], function (exports) {
    'use strict';
    return new BSRS_TICKET_DEFAULTS_OBJECT().defaults();
  });
}
