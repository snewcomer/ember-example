import Ember from 'ember';

var xhr = (url, verb, data, headers, status, response) => {
    //TODO: wipe out headers at some point
    var request = { url: url , method: verb };
    if (data) { 
        request.data = data;
        if(verb !== 'DELETE') {
            request.contentType = 'application/json';
        }
    }
    return Ember.$.fauxjax.new({
        request: request,
        response: {
            status: status,
            content: response
        }
    });
};

var clearxhr = (id) => {
    if (typeof id !== 'undefined') {
        Ember.$.fauxjax.remove(id);
    } else {
        Ember.$.fauxjax.clear();
    }
};

export {xhr, clearxhr};
