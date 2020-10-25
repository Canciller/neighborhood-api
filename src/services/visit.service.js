const Visit = require('../models/visit.model');
const UserService = require('../services/user.service');
class VisitService {
  async create(doc) {
    return await Visit.create(new Visit(doc));
  }

  async getById(id) {
    return await Visit.findById(id);
  }

  async get(username) {
    return await Visit.findOne({
      user: await UserService.get(username),
    }).populate('user');
  }

  async getAllVisits() {
    return await Visit.find();
  }

  async updateVisit(id) {
    return await Visit.findByIdAndUpdate(
      id,
      { $inc: { visits: 1 } },
      { new: true }
    );
  }
}

module.exports = new VisitService();
