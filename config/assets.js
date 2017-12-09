'use strict';

module.exports = {
  server: {
    allJS: ['server.js', 'config/**/*.js', 'modules/*/**/*.js', 'modules/*/sockets/**/*.js'],
    models: 'modules/*/models/**/*.js',
    routes: ['modules/!(core)/routes/**/*.js', 'modules/core/routes/**/*.js'],
    sockets: 'modules/*/sockets/**/*.js',
    configs: 'modules/*/configs/*.js',
  }
};
