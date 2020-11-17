const mongoose = require('mongoose');
const dbHandler = require('../dbHandler');
const VisitService = require('../../src/services/visit.service');
const UserService = require('../../src/services/user.service');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

let user = {
  username: 'user',
  email: 'userd@email.com',
  password: 'password',
  name: 'user',
};

let extra = {
  username: 'extra',
  email: 'extra@email.com',
  password: 'password',
  name: 'extra',
};

describe('VisitService', () => {
  describe('Create', () => {
    it('Success', async () => {
      const userCreated = await UserService.create(user);
      const visit = await VisitService.create(userCreated.id);

      expect(visit).toHaveProperty('user.id', userCreated.id);
      expect(visit).toHaveProperty('createdAt');
    });

    it('User not found', async () => {
      const visit = await VisitService.create(mongoose.Types.ObjectId());
      expect(visit).toBeNull();
    });

    it('Invalid user ID', async () => {
      let visit = await VisitService.create('invalid');
      expect(visit).toBeNull();

      visit = await VisitService.create(null);
      expect(visit).toBeNull();
    });
  });

  describe('Delete', () => {
    it('Success', async () => {
      const userCreated = await UserService.create(user);
      const visitCreated = await VisitService.create(userCreated.id);

      const visitDeleted = await VisitService.delete(
        userCreated.id,
        visitCreated.id
      );
      expect(visitDeleted).toHaveProperty('user.id', userCreated.id);
      expect(visitDeleted).toHaveProperty('id', visitCreated.id);
    });

    it('Visit not found', async () => {
      const userCreated = await UserService.create(user);
      const extraCreated = await UserService.create(extra);

      const visitCreated = await VisitService.create(userCreated.id);
      const visitExtraCreated = await VisitService.create(extraCreated.id);

      let visitDeleted = await VisitService.delete(
        userCreated.id,
        visitExtraCreated.id
      );
      expect(visitDeleted).toBeNull();

      let visitExtraDeleted = await VisitService.delete(
        extraCreated.id,
        visitCreated.id
      );
      expect(visitExtraDeleted).toBeNull();
    });

    it('Not found', async () => {
      const visit = await VisitService.delete(
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId()
      );
      expect(visit).toBeNull();
    });

    it('Invalid ID', async () => {
      let visit = await VisitService.delete('invalid', 'invalid');
      expect(visit).toBeNull();

      visit = await VisitService.delete(null, null);
      expect(visit).toBeNull();

      visit = await VisitService.delete('invalid', null);
      expect(visit).toBeNull();

      visit = await VisitService.delete(null, 'invalid');
      expect(visit).toBeNull();

      visit = await VisitService.delete();
      expect(visit).toBeNull();
    });
  });
});
