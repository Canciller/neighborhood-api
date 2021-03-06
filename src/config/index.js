const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const heroku = process.env.HEROKU === 'true';

const envFound = dotenv.config();
if (!heroku && envFound.error) {
  // This error should crash whole process.

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const port = process.env.PORT || 8000;

module.exports = {
  port,
  databaseURL: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  api: {
    url: process.env.DOMAIN || `http://localhost:${port}`,
    prefix: '/api',
  },
  saltRounds: process.env.SALT_ROUNDS || 10,
  mailer: {
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  appName: process.env.APP_NAME,
};
