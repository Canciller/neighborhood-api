const mongoose = require('mongoose');
const dbHandler = require('../dbHandler');
const UserService = require('../../src/services/user.service');

const GET_ALL_MAX_USERS = 10;

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

let user = {
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

let admin = {
  username: 'admin',
  email: 'admin@email.com',
  password: 'password',
  name: 'administrador',
  role: 'administrador',
};

let invalidUsername = {
  ...user,
  username: '??##!!$$  ==++',
};

describe('User service', () => {
  /**
   * Create
   */
  describe('Create', () => {
    it('Success - Default role', async () => {
      await expect(UserService.create(user)).resolves.toHaveProperty(
        'role',
        'residente'
      );

      await expect(UserService.create(extra)).resolves.toHaveProperty(
        'username',
        extra.username
      );

      await expect(UserService.create(admin)).resolves.toHaveProperty(
        'role',
        'administrador'
      );
    });

    it('Error - Empty', async () => {
      await expect(UserService.create()).rejects.toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });

    it('Error - Not unique', async () => {
      await expect(async () => {
        await UserService.create(user);
        await UserService.create(user);
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
      const created = await UserService.create(user);

      const updated = await UserService.updateById(created.id, {
        username: 'updated',
      });

      expect(updated).toHaveProperty('id', created.id);
      expect(updated).toHaveProperty('username', 'updated');
      expect(updated).toHaveProperty('email', created.email);
      expect(updated).toHaveProperty('name', created.name);
      expect(updated).toHaveProperty('role', 'residente');

      const sameUsernameAndEmail = await UserService.updateById(updated.id, {
        username: created.username,
        email: created.email,
      });

      expect(sameUsernameAndEmail).toHaveProperty(
        'id',
        sameUsernameAndEmail.id
      );
      expect(sameUsernameAndEmail).toHaveProperty(
        'username',
        sameUsernameAndEmail.username
      );
      expect(sameUsernameAndEmail).toHaveProperty(
        'email',
        sameUsernameAndEmail.email
      );
    });

    it('Error - Not unique', async () => {
      const createdValid = await UserService.create(user);
      const createdExtra = await UserService.create(extra);

      await expect(
        UserService.updateById(createdValid.id, {
          username: createdExtra.username,
        })
      ).rejects.toThrow();
    });

    it('Ignore invalid fields', async () => {
      const created = await UserService.create(user);

      const updated = await UserService.updateById(created.id, {
        invalid: 'invalid',
      });

      expect(updated).not.toHaveProperty('invalid');
      expect(updated).toHaveProperty('username', user.username);
    });

    /*
    // TODO: Find more about mongoose enum validator.
    it('Invalid role', async () => {
      const created = await UserService.create(user);

      await expect(
        UserService.updateById(created.id, {
          role: 'invalid',
        })
      ).rejects.toBeInstanceOf(mongoose.Error.ValidationError);
    });
    */

    it('User not found', async () => {
      const updated = await UserService.updateById(mongoose.Types.ObjectId());
      expect(updated).toBeNull();
    });

    it('Invalid ID', async () => {
      const updated = await UserService.updateById(null);
      expect(updated).toBeNull();
    });
  });

  /**
   * Get all
   */
  describe('Get all', () => {
    it('Success', async () => {
      let isVerifiedCount = 0,
        isActiveCount = 0;

      for (let i = 1; i <= GET_ALL_MAX_USERS; ++i) {
        let isVerified = Math.random() >= 0.5,
          isActive = Math.random() >= 0.5;

        if (isVerified) ++isVerifiedCount;
        if (isActive) ++isActiveCount;

        await UserService.create({
          username: `user${i}`,
          password: 'password',
          email: `user${i}@email.com`,
          name: 'name',
          isActive,
          isVerified,
        });
      }

      // Get all
      let users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
      });

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(GET_ALL_MAX_USERS);

      // Get all active
      users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
        isActive: true,
      });

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(isActiveCount);

      // Get all not active
      users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
        isActive: false,
      });

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(GET_ALL_MAX_USERS - isActiveCount);

      // Get all verified
      users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
        isVerified: true,
      });

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(isVerifiedCount);

      // Get all not verified
      users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
        isVerified: false,
      });

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(GET_ALL_MAX_USERS - isVerifiedCount);

      // Get all active and not verified
      users = await UserService.list({
        limit: GET_ALL_MAX_USERS,
        isActive: true,
        isVerified: false,
      });

      expect(Array.isArray(users)).toBeTruthy();
      for (i in users) {
        expect(users[i].isActive).toBeTruthy();
        expect(users[i].isVerified).toBeFalsy();
      }
    });

    it('Empty', async () => {
      const users = await UserService.list();

      expect(Array.isArray(users)).toBeTruthy();
      expect(users).toHaveLength(0);
    });
  });

  /**
   * Get
   */
  describe('Get', () => {
    it('Success', async () => {
      // Get
      const created = await UserService.create(user);

      let found = await UserService.getById(created.id);
      expect(found).toHaveProperty('id', created.id);

      found = await UserService.get(created.username);
      expect(found).toHaveProperty('id', created.id);
      expect(found).toHaveProperty('username', created.username);

      found = await UserService.get(created.email);
      expect(found).toHaveProperty('id', created.id);
      expect(found).toHaveProperty('email', created.email);

      // Exists
      const exists = await UserService.existsById(created.id);
      expect(exists).toBeTruthy();
    });

    it('User not found', async () => {
      const id = mongoose.Types.ObjectId();

      // Get
      const found = await UserService.getById(id);
      expect(found).toBeNull();

      // Exists
      const exists = await UserService.existsById(id);
      expect(exists).toBeFalsy();
    });

    it('Invalid ID', async () => {
      const found = await UserService.getById(null);
      expect(found).toBeNull();
    });
  });

  /**
   * Delete
   */
  describe('Delete', () => {
    it('Success', async () => {
      // Delete
      const created = await UserService.create(user);
      const deleted = await UserService.deleteById(created.id);

      expect(deleted).toHaveProperty('id', created.id);

      // Exists
      const exists = await UserService.existsById(deleted.id);
      expect(exists).toBeFalsy();
    });

    it('User not found', async () => {
      const deleted = await UserService.deleteById(mongoose.Types.ObjectId());
      expect(deleted).toBeNull();
    });

    it('Invalid ID', async () => {
      const deleted = await UserService.deleteById(null);
      expect(deleted).toBeNull();
    });
  });

  /**
   * Exists
   */
  describe('Exists', () => {
    it('Success', async () => {
      // Exists
      const created = await UserService.create(user);
      let exists = await UserService.existsById(created.id);

      expect(exists).toBeTruthy();

      exists = await UserService.exists(created.username);
      expect(exists).toBeTruthy();

      exists = await UserService.emailExists(created.email);
      expect(exists).toBeTruthy();

      exists = await UserService.exists(created.email);
      expect(exists).toBeTruthy();

      // Does not exist
      await UserService.deleteById(created.id);

      exists = await UserService.existsById(exists.id);
      expect(exists).toBeFalsy();

      exists = await UserService.exists(created.username);
      expect(exists).toBeFalsy();

      exists = await UserService.emailExists(created.email);
      expect(exists).toBeFalsy();

      exists = await UserService.exists(created.email);
      expect(exists).toBeFalsy();

      exists = await UserService.exists(null);
      expect(exists).toBeFalsy();
    });

    it('User not found', async () => {
      const exists = await UserService.existsById(mongoose.Types.ObjectId());
      expect(exists).toBeFalsy();
    });

    it('Invalid ID', async () => {
      let exists = await UserService.existsById(null);
      expect(exists).toBeFalsy();

      exists = await UserService.existsById('invalid');
      expect(exists).toBeFalsy();
    });
  });
});
