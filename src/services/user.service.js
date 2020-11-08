const User = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * TODO
 * Create tests for:
 *  update
 *  verify
 *  delete
 */

class UserService {
  /**
   * Create user.
   * @param {Object} doc
   * @param {string} doc.username
   * @param {string} doc.email
   * @param {string} doc.name
   * @param {string} doc.password
   * @param {string} doc.role - Default 'user'.
   * @param {boolean} doc.isActive - Default true.
   * @param {boolean} doc.isVerified - Default false.
   */
  async create(doc = {}) {
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
  async updateById(id, doc = {}) {
    delete doc.id;
    delete doc.isVerified;
    delete doc.createdAt;
    delete doc.updatedAt;

    if (ObjectId.isValid(id))
      return await User.findByIdAndUpdate(id, { $set: doc }, { new: true });
    else return null;
  }

  /**
   * Get user with username.
   * @param {string} username
   */
  async get(username) {
    return await User.findOne({
      $or: [{ username }, { email: username }],
    });
  }

  /**
   * Get user with id.
   * @param {string} id - User ID.
   */
  async getById(id) {
    if (ObjectId.isValid(id)) return await User.findById(id);
    else return null;
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
    if (ObjectId.isValid(id)) return await User.findByIdAndRemove(id);
    return null;
  }

  /**
   * Delete many users by id.
   * @param {Array} arr - User array.
   */
  async deleteManyById(arr = []) {
    // TODO: Implement this.
  }

  /**
   * List users.
   * @param {Object} query
   * @param {number} query.skip - Number of users to be skipped.
   * @param {number} query.limit - Limit number of users to be returned.
   * @param {isActive} query.isActive
   * @param {isVerified} query.isVerified
   * @param {role} query.role - Role of users to be returned.
   */
  async list({ skip = 0, limit = 100, isActive, isVerified, role } = {}) {
    let query = {};

    if (isActive !== undefined) query.isActive = isActive;
    if (isVerified !== undefined) query.isVerified = isVerified;
    if (role !== undefined) query.role = role;

    return await User.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }

  /**
   * Check if user with username exists.
   * @param {string} username
   * @returns {boolean}
   */
  async exists(username) {
    return await User.exists({
      $or: [{ username }, { email: username }],
    });
  }

  /**
   * Check if user exists by id.
   * @param {string} id - User ID.
   * @returns {boolean}
   */
  async existsById(id) {
    if (ObjectId.isValid(id)) return await User.exists({ _id: id });

    return false;
  }

  /**
   * Check if user with email exists.
   * @param {string} email
   * @returns {boolean}
   */
  async emailExists(email) {
    return await User.exists({ email });
  }

  /**
   * Check if user is active by id.
   * @param {string} id - User ID.
   */
  async isActiveById(id) {
    const user = await this.getById(id);
    return user && user.isActive;
  }

  /**
   * Check if user is verified by id.
   * @param {string} id - User ID.
   */
  async isVerifiedById(id) {
    const user = await this.getById(id);
    return user && user.isVerified;
  }
}

module.exports = new UserService();
