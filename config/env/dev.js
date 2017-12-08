'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  domain: {
    url: 'http://localhost:5500',
    version: 'v1',
  },
  db: {
    uri: 'mongodb://gopool_db:123456@ds013971.mlab.com:13971/gopool',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '371916107990-4o9m8pqhet4421fghcglrfuvofnmvtjp.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'sIelZIG6HIn13knns_gawb3r',
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'matkraftweb@gmail.com',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'mailgun',
      domain: '184.173.153.200',
      // driver: 'smtp' || 'mailgun,
      // secret: 'key-5bafff675168c328be2f4726d8389d14',
      // host: 'smpt.mailgun.org',
      port: '587',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'postmaster@sandboxdd108448733a41479e5b3dea96101081.mailgun.org',
        pass: process.env.MAILER_PASSWORD || 'eea680aee871089d8aee4180f517d6ba'
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
