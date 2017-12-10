'use strict';

/**
 * Module dependencies.
 */

require('../../models/users');

var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  async = require('async'),
  userModel = mongoose.model('Users'),
  chalk = require('chalk');


/**
 * Get Users details
 * @param: id (int|all) category id or all
 * @return: category (array | object)
 */
exports.getUsers = function (req) {
  logInConsole('Calling for getting users');
  var query = {};
  if (req.params.id) {
    query = { id: req.params.id };
  }
console.log(req.params.id)
  return new Promise(function (resolve, reject) {
    if (req.params.id) {
      userModel.find(query).exec()
        .then(function (user) {
          logInConsole('User has fetched successfully', 'success');
          resolve(user);
        }, function (err) {
          logInConsole('User has not fetched successfully because of : '+ err, 'fail');
          reject(err);
        });
    } else {
      userModel.find(query).exec()
        .then(function (users) {
          logInConsole('User has fetched successfully', 'success');
          resolve(users);
        }, function (err) {
           logInConsole('User has not fetched successfully because of : '+ err, 'fail');
          reject(err);
        });
    }
  });
};
/**
 * Save users details
 * @param: req (object) request object with params & data
 * @return: users (array | object)
 */
exports.saveUsers = function (req, res) {

  logInConsole('Calling for saving users');
  
  return new Promise(function(resolve, reject) {

    if (! _.isUndefined(req.params.id) && req.params.id !== '') {
      userModel.findById(req.params.id).exec()
        .then(function(user) {
          user = _.merge(user, req.body);
          user.save()
          .then(function(user) { 
            logInConsole('User has updated successfully', 'success');
            resolve(user); 
          }, function(err) { 
            logInConsole('User has not updated successfully because of : '+ err, 'fail');
            reject(err); 
          });
        }, function(err) { reject(err); });
    } else {
      var userObj = new userModel(req.body);
      userObj.save()
        .then(function(user) { 
          logInConsole('User has created successfully', 'success');
          resolve(user); 
        }, function(err) { 
          logInConsole('User has not created successfully because of : '+ err, 'fail');
           reject(err); 
        });
    }
  });
};

function logInConsole(msg, type) {
  switch(type){
    case 'success':
      console.log(chalk.green(msg));
      break;
    case 'fail':
      console.log(chalk.red(msg));
      break;
    default:
      console.log(msg);
  }
}

