'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  async = require('async'),
  require('../../models/users'),
  userModel = mongoose.model('Users');

/**
 * Get Users details
 * @param: id (int|all) category id or all
 * @return: category (array | object)
 */
exports.getUsers = function (req) {
  var query = {};
  if (req.params.id) {
    query = { id: req.params.id, deleteFlag: false };
  }

  return new Promise(function (resolve, reject) {
    if (req.params.id) {
      userModel.find(query).exec()
        .then(function (user) {
          resolve(user);
        }, function (err) {
          reject(err);
        });
    } else {
      mserModel.find(query).exec()
        .then(function (users) {
          resolve(users);
        }, function (err) {
          reject(err);
        });
    }
  });
};
/**
 * Save users details
 * @param: req (object) request object with params & data
 * @return: bom (array | object)
 */
exports.save = function (req, res) {
  return new Promise(function (resolve, reject) {
      var err1 = new Error('users Field id not found to save or update bom details');
      reject(err1);
  });
};

