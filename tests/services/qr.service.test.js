const mongoose = require('mongoose');
const dbHandler = require('../dbHandler');
const QRService = require('../../src/services/qr.service');
const UserService = require('../../src/services/user.service');

const GET_ALL_MAX_QR = 4;

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

let user = {
  username: 'user',
  email: 'userd@email.com',
  password: 'password',
  name: 'user',
};

describe('QRService', () => {
  describe('Generate', () => {
    it('Success', async () => {
      const userCreated = await UserService.create(user);
      let qrCreated = await QRService.generate(userCreated.id);

      // Create
      expect(qrCreated).toHaveProperty('user.id', userCreated.id);
      expect(qrCreated).toHaveProperty('code');
      expect(qrCreated).toHaveProperty('image');
      expect(qrCreated).toHaveProperty('enabled', false);

      // Enable
      await QRService.enable(userCreated.id);

      // Update
      let qrUpdated = await QRService.generate(userCreated.id);
      expect(qrUpdated).toHaveProperty('user.id', userCreated.id);
      expect(qrUpdated).not.toHaveProperty('code', qrCreated.code);
      expect(qrUpdated).not.toHaveProperty('image', qrCreated.image);
      expect(qrUpdated).toHaveProperty('enabled', true);
    });

    it('Enable and disable', async () => {
      const userCreated = await UserService.create(user);
      let qrCreated = await QRService.generate(userCreated.id);

      // Enable
      let qr = await QRService.enable(userCreated.id);
      expect(qr).toHaveProperty('user.id', userCreated.id);
      expect(qr).toHaveProperty('code', qrCreated.code);
      expect(qr).toHaveProperty('image', qrCreated.image);
      expect(qr).toHaveProperty('enabled', true);

      qr = await QRService.disable(userCreated.id);
      expect(qr).toHaveProperty('user.id', userCreated.id);
      expect(qr).toHaveProperty('code', qrCreated.code);
      expect(qr).toHaveProperty('image', qrCreated.image);
      expect(qr).toHaveProperty('enabled', false);
    });

    it('User not found', async () => {
      const qrCreated = await QRService.generate(mongoose.Types.ObjectId());
      expect(qrCreated).toBeNull();
    });

    it('Invalid user ID', async () => {
      let qrCreated = await QRService.generate(null);
      expect(qrCreated).toBeNull();

      qrCreated = await QRService.generate('invalid');
      expect(qrCreated).toBeNull();
    });
  });

  describe('Get', () => {
    it('Success', async () => {
      const userCreated = await UserService.create(user);
      await QRService.generate(userCreated.id);
      let qrFound = await QRService.get(userCreated.id);

      expect(qrFound).toHaveProperty('user.id', userCreated.id);
      expect(qrFound).toHaveProperty('code');
      expect(qrFound).toHaveProperty('image');
      expect(qrFound).toHaveProperty('enabled', false);
    });

    it('QR not found', async () => {
      const created = await UserService.create(user);
      const found = await QRService.get(created.id);

      expect(found).toBeNull();
    });

    it('User not found', async () => {
      const found = await QRService.get(mongoose.Types.ObjectId());
      expect(found).toBeNull();
    });

    it('Invalid user ID', async () => {
      let found = await QRService.get(null);
      expect(found).toBeNull();

      found = await QRService.get('invalid');
      expect(found).toBeNull();
    });
  });

  describe('Match', () => {
    it('Success', async () => {
      const userCreated = await UserService.create(user);
      let qrCreated = await QRService.generate(userCreated.id);

      let match = await QRService.match(
        userCreated.id,
        QRService.generateCode()
      );
      expect(match).toBeFalsy();

      await QRService.enable(userCreated.id);

      match = await QRService.match(userCreated.id, qrCreated.code);
      expect(match).toBeTruthy();
    });

    it('User not found', async () => {
      let match = await QRService.match(
        mongoose.Types.ObjectId(),
        QRService.generateCode()
      );
      expect(match).toBeFalsy();
    });

    it('Invalid user ID', async () => {
      let match = await QRService.match(null, QRService.generateCode());
      expect(match).toBeFalsy();

      match = await QRService.match('invalid', QRService.generateCode());
      expect(match).toBeFalsy();
    });
  });

  describe('Get all', () => {
    it('Empty', async () => {
      expect(await QRService.list()).toHaveLength(0);
    });
  });
});
