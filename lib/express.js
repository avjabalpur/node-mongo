'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/appconfig'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  path = require('path');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Allow Access-Control-Allow-Origin (CORS)
 */
module.exports.allowCORS = function(app) {
  app.use(function (req, res, next) {
    // var headers = {};

    // set header to handle the CORS
    // headers['Access-Control-Allow-Origin'] = 'http://localhost:9000';
    // headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
    // headers['Access-Contrl-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
    // headers['Access-Control-Max-Age'] = '86400';
    // res.writeHead(200, headers);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origin

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // check request method is option to end request with 200 response code
    if (req.method === 'OPTIONS') {
      console.log('OPTIONS SUCCESS');
      // res.writeHead(200);
      res.json({ success: true });
      // res.end();
    }

    // Pass to next layer of middleware
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  app.use(express.static('data/img'));

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));


  //modify beccouse of increse the json payload bom
  app.use(bodyParser.json({ limit: '5mb' }));
  //app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser
  app.use(cookieParser());
};



/**
 * Configure JWT session
 */
module.exports.initSession = function (app, db) {
  // set jwt super secret key
  app.set('superSecret', config.jwtSuperSecret); // secret variable

  // jwtSession: {
  //   session: false
  // }
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, router) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app, router);
  });
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app, router) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app, router);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  // undefined routes will goes here
  app.use(function(req, res) {
    res.status(500).send({
      'response': 'error',
      'error': {
        'message': 'Oops! Something went wrong...'
      }
    });
  });

  // error routes goes here
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // console.log(err);
    // console.log(err.message);
    // Log it
    // console.error(err.stack);

    // return the error response with message
    res.status(err.status || 500);
    res.send({
      'response': 'error',
      'error': {
        'message': err.message,
        'errors': err,
        'stack': err.stack
      }
    });
  });

};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();
  var router = express.Router();

  app.use('/storage', express.static(process.cwd() + '/storage'));

  // allow CROS
  this.allowCORS(app);

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app, router);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app, router);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};
