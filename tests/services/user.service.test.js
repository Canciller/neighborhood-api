const mongoose = require('mongoose');
const dbHandler = require('../dbHandler');
const UserService = require('../../src/services/user.service');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

let valid = {
  username: 'valid',
  email: 'valid@email.com',
  password: 'password',
  name: 'valid',
};

let extra = {
  username: 'extra',
  email: 'extra@email.com',
  password: 'password',
  name: 'extra',
};

let invalidUsername = {
  ...valid,
  username: '??##!!$$  ==++',
};

describe('User service', () => {
  /**
   * Create
   */
  describe('Create', () => {
    it('Success - Default role', async () => {
      await expect(UserService.create(valid)).resolves.toHaveProperty(
        'role',
        'user'
      );

      await expect(UserService.create(extra)).resolves.toHaveProperty(
        'username',
        extra.username
      );
    });

    it('Error - Not unique', async () => {
      await expect(async () => {
        await UserService.create(valid);
        await UserService.create(valid);
      }).rejects.toThrow();
    });

    it('Error - Invalid username', async () => {
      await expect(UserService.create(invalidUsername)).rejects.toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });

    it('Error - Missing required fields', async () => {
      await expect(UserService.create({})).rejects.toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });

  /**
   * Update
   */
  describe('Update', () => {
    it('Success', async () => {
      const created = await UserService.create(valid);

      const updated = await UserService.updateById(created.id, {
        username: 'updated',
      });

      expect(updated).toHaveProperty('id', created.id);
      expect(updated).toHaveProperty('username', 'updated');
      expect(updated).toHaveProperty('email', created.email);
      expect(updated).toHaveProperty('name', created.name);
      expect(updated).toHaveProperty('role', 'user');
    });

    it('Error - Not unique', async () => {
      const createdValid = await UserService.create(valid);
      const createdExtra = await UserService.create(extra);

      await expect(
        UserService.updateById(createdValid.id, {
          username: createdExtra.username,
        })
      ).rejects.toThrow();
    });

    it('Ignore invalid fields', async () => {
      const created = await UserService.create(valid);

      const updated = await UserService.updateById(created.id, {
        invalid: 'invalid',
      });

      expect(updated).not.toHaveProperty('invalid');
      expect(updated).toHaveProperty('username', valid.username);
    });

    it('User not found', async () => {
      const updated = await UserService.updateById(mongoose.Types.ObjectId());
      expect(updated).toBeNull();
    });
  });

  /**
   * Delete
   */
  describe('Delete', () => {
    it('Success', async () => {
      const created = await UserService.create(valid);
      const deleted = await UserService.deleteById(created.id);

      expect(deleted).toHaveProperty('id', created.id);
    });
  });
});
