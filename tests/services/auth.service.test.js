const dbHandler = require('../dbHandler');

const AuthService = require('../../src/services/auth.service');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('AuthService', () => {
  describe('Sign in', () => {
    it('Success', () => {});
  });
});
