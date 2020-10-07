const winston = require('winston');
const config = require('../config');

const LoggerInstance = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(({
      timestamp,
      level,
      message,
      meta,
      stack
    }) => {
      return `${timestamp} ${level}: ${stack || message} ${meta? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = LoggerInstance;
