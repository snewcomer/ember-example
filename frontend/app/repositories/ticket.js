import Ember from 'ember';
import PromiseMixin from 'ember-promise/mixins/promise';
import inject from 'frontend/utilities/deserializer';
import { TICKETS_URL, PEOPLE_URL } from 'frontend/utilities/urls';

var TicketRepo = Ember.Object.extend({
  type: 'ticket',
  url: TICKETS_URL,
  TicketDeserializer: inject('ticket'),
  deserializer: Ember.computed.alias('TicketDeserializer'),
  findById(id){
    const url = this.get('url');
    const deserializer = this.get('deserializer');
    return PromiseMixin.xhr(`${url}${id}/`, 'GET').then((response) => {
      return deserializer.deserialize(response, id);
    }, (xhr) => {
      if(xhr.status === 400 || xhr.status === 404){
        const err = xhr.responseJSON;
        const key = Object.keys(err);
        return Ember.RSVP.Promise.reject(err[key[0]]);
      }
    });
  },
  update(model) {
    return PromiseMixin.xhr(this.get('url') + model.get('id') + '/', 'PUT', {data: JSON.stringify(model.serialize())}).then(() => {
      model.save();
      model.saveRelated();
    });
  },
  fetch(id) {
    const type = this.get('type');
    const store = this.get('simpleStore');
    return store.find(type, id);
  },
  findPeople(search) {
    let url = PEOPLE_URL;
    search = search ? search.trim() : search;
    if (search) {
      url += `person__icontains=${search}/`;
      return PromiseMixin.xhr(url, 'GET').then((response) => {
        return response.results;
      });
    }
  }
});

export default TicketRepo;
