const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process.

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  port: process.env.PORT,
  databaseURL: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  api: {
    prefix: '/api'
  },
  saltRounds: process.env.SALT_ROUNDS || 10
}