'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  async = require('async'),
  users = require('./sources/users'),
  errorHandler = require(path.resolve('./modules/core/controllers/error-controller'));

/**
 * Get users Data
 */
module.exports.getUsers = function (req, res, done) {
  console.log('____________________+++++++++++++++++++=');
  async.waterfall([
    function (next) {
      // user - project (one to one)
      users.getUsers(req)
        .then(function (users) { next(null, users); }, function (err) { done(null, err); });
    },
    function (users, next) {
      res.send({ status: 'success', data: users });
    }
  ], function (err) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }
  });
};

/**
 * Save users
 */
module.exports.saveUsers = function (req, res, done) {
  async.waterfall([
    function (next) {
      users.save(req, res)
        .then(function(user) { next(null, user); }, function(err) { done(null, err); });
    },
    function (user, next) {
      res.send({ status: 'success', msg: 'users saved successfully', data: user });
    }
  ], function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};



