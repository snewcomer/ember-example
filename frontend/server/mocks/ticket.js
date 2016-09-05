var TICKET_FIXTURES = require('../../vendor/ticket_fixtures.js');

module.exports = function(app) {
  var express = require('express');
  var adminTicketsRouter = express.Router();

  adminTicketsRouter.get('/', function(req, res) {
    console.log('shit')
    res.send(TICKET_FIXTURES.list());
  });

  adminTicketsRouter.get('/:id', function(req, res) {
    res.send(TICKET_FIXTURES.detail(req.params.id));
  });

  adminTicketsRouter.put('/:id', function(req, res) {
    res.send(TICKET_FIXTURES.put(req.params.id));
  });

  app.use('/api/tickets/', adminTicketsRouter);
};
