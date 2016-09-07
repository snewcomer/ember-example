var BSRS_PEOPLE_FACTORY = (function() {
  var factory = function(person_defaults) {
    this.person_defaults = person_defaults;
  };
  factory.prototype.get = function(i) {
    //right now function used for tickets
    var first_name = this.person_defaults.first_name;
    var last_name = this.person_defaults.last_name;
    var fullname = first_name + ' ' + last_name;
    return {
      id: i || this.person_defaults.id,
      first_name: first_name,
      last_name: last_name,
      fullname: fullname,
    }
  };
  // factory.prototype.get_no_related = function(i, first_name, last_name) {
  //   /* power select and ticket assignee */
  //   var first_name = first_name || this.person_defaults.first_name;
  //   var last_name = last_name || this.person_defaults.last_name;
  //   var fullname = first_name + ' ' + last_name;
  //   return {
  //     id: i || this.person_defaults.id,
  //     first_name: first_name,
  //     last_name: last_name,
  //     fullname: fullname,
  //     title: 'wat'
  //   }
  // };
  factory.prototype.generate = function(i) {
    return {
      id: i,
      username : this.person_defaults.username,
      first_name : this.person_defaults.first_name,
      middle_initial : this.person_defaults.middle_initial,
      last_name : this.person_defaults.last_name,
      title : this.person_defaults.title,
    }
  };
  factory.prototype.generate_list = function(i) {
    return {
      id: i,
      username : this.person_defaults.username,
      first_name : this.person_defaults.first_name,
      middle_initial : this.person_defaults.middle_initial,
      last_name : this.person_defaults.last_name,
    }
  };
  factory.prototype.detail = function(i, username) {
    var j = i || this.person_defaults.idOne;
    var person = this.generate(j);
    var current_username = person.username;
    person.username = username || current_username;
    return person;
  };
  factory.prototype.list = function() {
    var response = [];
    for (var i=1; i <= 10; i++) {
      var uuid = '139543cf-8fea-426a-8bc3-09778cd799';
      if (i < 25) {
        uuid = uuid + '0' + i;
      } else {
        uuid = uuid + i;
      }
      var person = this.generate_list(uuid);
      //TODO: DRY this up
      person.username = 'mgibson' + i;
      person.first_name = 'Mel' + i;
      person.last_name = 'Gibson' + i;
      person.fullname = person.first_name + ' ' + person.last_name;
      person.title = i + ' MVP';
      response.push(person);
    }
    return {count:10*2-2,next:null,previous:null,results: response};
  };
  return factory;
})();

if (typeof window === 'undefined') {
  var person_defaults = require('../vendor/defaults/person');
  module.exports = new BSRS_PEOPLE_FACTORY(person_defaults);
} else {
  define('frontend/vendor/person_fixtures', ['exports', 'frontend/vendor/defaults/person'],
         function (exports, person_defaults) {
           'use strict';
           var Factory = new BSRS_PEOPLE_FACTORY(person_defaults);
           return {default: Factory};
         });
}
