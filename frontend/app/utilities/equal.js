import Ember from 'ember';

var equal = function(first, second) {
    if (first instanceof Array && second instanceof Array) {
        return Ember.$(first).not(second).get().length === 0 && Ember.$(second).not(first).get().length === 0;
    }
    return first === second;
};

export default equal;
