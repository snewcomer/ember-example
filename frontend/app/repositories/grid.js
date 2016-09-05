import Ember from 'ember';
import PromiseMixin from 'ember-promise/mixins/promise';
import inject from 'frontend/utilities/deserializer';
import { TICKETS_URL } from 'frontend/utilities/urls';

var GridRepo = Ember.Object.extend({
  url: TICKETS_URL,
  TicketDeserializer: inject('ticket'),
  deserializer: Ember.computed.alias('TicketDeserializer'),
  find(){
    const url = this.get('url');
    const deserializer = this.get('deserializer');
    return PromiseMixin.xhr(url, 'GET').then((response) => {
      return deserializer.deserialize(response);
    }, (xhr) => {
      if(xhr.status === 400 || xhr.status === 404){
        const err = xhr.responseJSON;
        const key = Object.keys(err);
        return Ember.RSVP.Promise.reject(err[key[0]]);
      }
    });
  },
});

export default GridRepo;
