const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');

module.exports = async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  console.log('DB loaded and connected');

  await expressLoader({ app: expressApp });
  console.log('Express loaded');
}