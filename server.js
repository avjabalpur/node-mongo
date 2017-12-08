'use strict';

/**
 * Module dependencies.
 */
var app = require('./lib/app');
var chalk = require('chalk');

 console.log(chalk.green('======================== starting app =============================='));
var server = app.start();
