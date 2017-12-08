'use strict';

/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // BOM Routes
  var users = require('../controllers/users');

  // BOM routes
  router.post('/users', BOM.saveBOM);
  // load the BOM router in the app
  app.use('/api/v1', router);

};
