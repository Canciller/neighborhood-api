const mongoose = require('mongoose');
const dbHandler = require('../dbHandler');
const QRService = require('../../src/services/qr.service');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('QRService', () => {
  it('Create', async () => {
    /*
    console.log(
      await QRService.generate(mongoose.Types.ObjectId().toHexString())
    );
    */
  });
});
