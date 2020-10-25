const User = require('../models/user.model');

class UserService {
  /**
   * Create user.
   * @param {Object} doc
   * @param {string} doc.username
   * @param {string} doc.email
   * @param {string} doc.name
   * @param {string} doc.password
   * @param {string} doc.role - Default 'user'.
   */
  async create(doc) {
    return await User.create(new User(doc));
  }

  /**
   * Update user with username.
   * @param {string} username
   * @param {Object} doc
   */
  async update(username, doc) {
    return await User.findOneAndUpdate(
      { username: username },
      { $set: doc },
      { new: true }
    );
  }

  /**
   * Update user with id.
   * @param {string} id - User ID.
   * @param {Object} doc
   */
  async updateById(id, doc) {
    return await User.findByIdAndUpdate(id, { $set: doc }, { new: true });
  }

  /**
   * Get user with username.
   * @param {string} username
   */
  async get(username) {
    return await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
  }

  /**
   * Get user with id.
   * @param {string} id - User ID.
   */
  async getById(id) {
    return await User.findById(id);
  }

  /**
   * Verify user with username.
   * @param {string} username
   */
  async verify(username) {
    return await this.update(username, {
      isVerified: true,
    });
  }

  /**
   * Verify user with id.
   * @param {string} id - User ID.
   */
  async verifyById(id) {
    return await this.updateById(id, {
      isVerified: true,
    });
  }

  /**
   * Delete user with username.
   * @param {string} username
   */
  async delete(username) {
    return await User.findOneAndRemove({ username });
  }

  /**
   * Delete user with id.
   * @param {string} id - User ID.
   */
  async deleteById(id) {
    return await User.findByIdAndRemove(id);
  }

  /**
   * List users.
   * @param {Object} query
   * @param {number} query.skip - Number of users to be skipped.
   * @param {number} query.limit - Limit number of users to be returned.
   */
  async list(query) {
    return await User.list(query);
  }

  /**
   * Check if user with username exists.
   * @param {string} username
   * @returns {boolean}
   */
  async exists(username) {
    return await User.exists({ username });
  }

  /**
   * Check if user with id exists.
   * @param {string} id - User ID.
   * @returns {boolean}
   */
  async existsById(id) {
    return await User.exists({ _id: id });
  }

  /**
   * Check if user with email exists.
   * @param {string} email
   */
  async emailExists(email) {
    return await User.exists({ email });
  }
}

module.exports = new UserService();
