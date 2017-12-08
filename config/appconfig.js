'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};


/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {}
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.configs);

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting Globbed CSS files
  config.files.server.css = getGlobbedPaths(assets.server.css);
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {

  // Get the default assets
  var assets = require(path.join(process.cwd(), './config/assets'));

  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), './config/env/default'));

  // Get the current config
  var devConfig = require(path.join(process.cwd(), './config/env/', 'dev')) || {};

  // Merge config files
  var config = _.merge(defaultConfig, devConfig);

  // read package.json for MEAN.JS project information
  var pkg = require(path.resolve('./package.json'));

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);
  config.meanjs = pkg;

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
