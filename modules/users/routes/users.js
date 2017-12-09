'use strict';

/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // users Routes
  var users = require('../controllers/users');

  router.get('/users', users.getUsers);
  router.post('/users', users.saveUsers);
  router.put('/users/:id', users.saveUsers);
  // load the BOM router in the app
  app.use('/api/v1', router);

};