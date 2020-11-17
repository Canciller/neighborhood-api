const Visit = require('../models/visit.model');
const ObjectId = require('mongoose').Types.ObjectId;
const UserService = require('../services/user.service');

class VisitService {
  /**
   * Create visit.
   * @param {string} user - User ID.
   */
  async create(user) {
    const exists = await UserService.existsById(user);

    if (exists && ObjectId.isValid(user)) {
      const visit = await Visit.create({
        user: user,
      });

      return await visit.populate('user').execPopulate();
    }

    return null;
  }

  /**
   * Get visits for user.
   * @param {string} user - User ID.
   * @param {Object} query
   * @param {number} query.skip - Number of visits to be skipped.
   * @param {number} query.limit - Limit number of visits to be returned.
   */
  async get(user, { skip = 0, limit = 100 } = {}) {
    if (ObjectId.isValid(user))
      return await Visit.find({
        user: user,
      })
        .populate('user')
        .sort({
          createdAt: -1,
        })
        .skip(+skip)
        .limit(+limit)
        .exec();

    return [];
  }

  /**
   * Delete visit.
   * @param {string} user - User ID.
   * @param {string} id - Visit ID.
   */
  async delete(user, id) {
    if (ObjectId.isValid(user) && ObjectId.isValid(id))
      return await Visit.findOneAndDelete({
        _id: id,
        user: user,
      }).populate('user');

    return null;
  }
}

module.exports = new VisitService();
