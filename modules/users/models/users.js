'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$inside model');

/**
 * Load instanciated BOMSchema
 */
var userSchema = require('./schema/users');

/**
 * Hook a pre save method to add date
 */
userSchema.pre('save', function (next) {

  if (!this.createdAt) {
    this.createdAt = Date.now();
  }

  this.updatedAt = Date.now();

  next();
});
var diffHistory = require('mongoose-diff-history/diffHistory').plugin;
userSchema.plugin(diffHistory);

mongoose.model('Users', userSchema);