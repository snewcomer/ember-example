const BSRS_PERSON_ID = '139543cf-8fea-426a-8bc3-09778cd79901';
const BSRS_PERSON_ORIG_USERNAME = 'mgibson';
const BSRS_PERSON_SORTED_USERNAME = 'wanker';
const BSRS_PERSON_USERNAME = BSRS_PERSON_ORIG_USERNAME + '1';
const BSRS_PERSON_PASSWORD = 'Wanker1';
const BSRS_PERSON_EMAIL = [];
const BSRS_PERSON_ORIG_FIRST_NAME = 'Mel';
const BSRS_PERSON_FIRST_NAME = BSRS_PERSON_ORIG_FIRST_NAME + '1';
const BSRS_PERSON_MIDDLE_INITIAL = 'B';
const BSRS_PERSON_ORIG_LAST_NAME = 'Gibson';
const BSRS_PERSON_LAST_NAME = BSRS_PERSON_ORIG_LAST_NAME + '1';
const BSRS_PERSON_ORIG_TITLE = 'MVP';
const BSRS_PERSON_TITLE = '1 ' + BSRS_PERSON_ORIG_TITLE;

var BSRS_PERSON_DEFAULTS_OBJECT = (function() {
  var factory = function() {
  };
  factory.prototype.defaults = function() {
    return {
      id: BSRS_PERSON_ID,
      idOne: BSRS_PERSON_ID,
      idTwo: '8b881d03-ac0b-4e4c-9d30-8a1d3d7d0783',
      idThree: '8b881d03-ac0b-4e4c-9d30-8a1d3d7d0784',
      idBoy: '249543cf-8fea-426a-8bc3-09778cd78001',
      idDonald: 'b783a238-5631-4623-8d24-81a672bb4ea0',
      idSearch: '249543cf-8fea-426a-8bc3-09778cd78002',
      username: BSRS_PERSON_USERNAME,
      first_name: BSRS_PERSON_FIRST_NAME,
      middle_initial: BSRS_PERSON_MIDDLE_INITIAL,
      last_name: BSRS_PERSON_LAST_NAME,
      fullname: BSRS_PERSON_FIRST_NAME + ' ' + BSRS_PERSON_LAST_NAME,
      title: BSRS_PERSON_TITLE,

      scott_username: 'scott11',
      donald_first_name: 'Donald',
      donald_last_name: 'Trump',
      donald: 'Donald Trump',
      nameOne: 'wanker',
      nameTwo: 'bonker',
      nameThree: 'tommy',
      nameMel: 'Mel1 Gibson1',
      nameBoy: 'Boy1',
      nameBoy2: 'Boy2',
      fullnameBoy: 'Boy1 Man1',
      fullnameBoy2: 'Boy2 Man2',
      lastNameOne: 'A',
      lastNameTwo: 'B',
      lastNameThree: 'C',
      lastNameBoy: 'Man1',
      lastNameBoy2: 'Man2',
      titleOne: 'Pres',
      titleTwo: 'Vice Pres',
      titleThree: 'Manager',
      usernameOne: 'snewco',
      usernameTwo: 'tbillups',
      usernameThree: 'alevier',
      emailOne: 'snewco@gmail.com',
      emailTwo: 'tbillups@gmail.com',
      emailThree: 'alevier@aol.com',
    };
  };
  return factory;
})();

if (typeof window === 'undefined') {
  module.exports = new BSRS_PERSON_DEFAULTS_OBJECT().defaults();
}
else {
  define('frontend/vendor/defaults/person', ['exports'],
    function(exports) {
      'use strict';
      return new BSRS_PERSON_DEFAULTS_OBJECT().defaults();
    });
}
