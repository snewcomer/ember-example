var BSRS_TICKET_FACTORY = (function() {
  var factory = function(ticket, person_defaults, person_fixtures) {
    this.ticket = ticket;
    this.person_defaults = person_defaults.default || person_defaults;
    this.person_fixtures = person_fixtures.default || person_fixtures;
  };
  factory.prototype.generate = function(i) {
    return {
      id: i,
      request: this.ticket.requestOne,
      status_fk: this.ticket.statusOneId,
      assignee: this.person_fixtures.get(),
      cc: [this.person_fixtures.get_no_related()],
    }
  };
  factory.prototype.detail = function(i) {
    return this.generate(i);
  };
  factory.prototype.put = function(ticket) {
    var response = this.generate(ticket.id);
    response.cc = [response.cc[0].id];
    response.assignee = response.assignee.id;
    response.status = response.status_fk;
    delete response.status_fk;
    for(var key in ticket) {
      response[key] = ticket[key];
    }
    return response;
  };
  return factory;
})();

if (typeof window === 'undefined') {
  var objectAssign = require('object-assign');
  var ticket_defaults = require('./defaults/ticket');
  var person_defaults = require('./defaults/person');
  var person_fixtures = require('../vendor/person_fixtures');
  module.exports = new BSRS_TICKET_FACTORY(ticket_defaults, person_defaults, person_fixtures);
} else {
  define('frontend/vendor/ticket_fixtures', ['exports', 'frontend/vendor/defaults/ticket', 'frontend/vendor/defaults/person', 'frontend/vendor/person_fixtures'],
         function (exports, ticket_defaults, person_defaults, person_fixtures) {
         'use strict';
         var Factory = new BSRS_TICKET_FACTORY(ticket_defaults, person_defaults, person_fixtures);
         return {default: Factory};
});
}
