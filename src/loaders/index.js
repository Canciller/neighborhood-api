const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
}