/* jshint node: true */
'use strict';

module.exports = {
  name: 'components',
  contentFor: function(type) {
    var environment = this.app.env.toString();
    var config_data = '';
    if (type === 'head') {
      if (environment === 'production') {
        config_data += "<script type='text/preload' charset='utf-8' data-preload-ticket-statuses='ticket_statuses' data-configuration='{{ticket_statuses|escape}}'></script>";
      } else {
        config_data += "<script type='text/preload' charset='utf-8' data-preload-ticket-statuses='ticket_statuses' data-configuration='[{\"id\": \"5ab9b1fb-c624-4214-bb4c-16567b3d37e6\",\"name\":\"ticket.status.new\"},{\"id\": \"e30f3033-ae2a-4af6-9d3a-ea7c98056c1d\",\"name\":\"ticket.status.deferred\"},{\"id\": \"3ca0de41-540a-423b-84ca-a48add0acbdf\", \"name\":\"ticket.status.in_progress\"},{\"id\": \"ba2ed214-269b-455b-af40-fe4d74fa9551\", \"name\":\"ticket.status.complete\"},{\"id\": \"2926a989-3192-4f8f-9a37-cfb3985d0821\", \"name\":\"ticket.status.denied\"},{\"id\": \"e845fd81-1fef-4eee-ad38-7460c818854a\", \"name\":\"ticket.status.problem_solved\"},{\"id\": \"dfa1f64f-d0d7-4915-be85-54b8c38d3aeb\", \"name\":\"ticket.status.draft\", \"default\": true},{\"id\": \"820dfa6c-003b-42f4-8f10-6b78f8b40c6a\", \"name\":\"ticket.status.unsatisfactory_completion\"}]'></script>";
      }
      return config_data;
    }
    if (type === 'body-footer') {
      if (environment === 'production') {
        return '<script type="text/javascript">jQuery(document).ajaxSend(function(event, xhr, settings) { if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) { xhr.setRequestHeader("X-CSRFToken", "{{csrf_token}}"); } }); </script>';
      } else {
        return '<script type="text/javascript">jQuery(document).ajaxSend(function(event, xhr, settings) { if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) { xhr.setRequestHeader("X-CSRFToken", "faketoken1234"); } }); </script>';
      }
    }
  }
};
