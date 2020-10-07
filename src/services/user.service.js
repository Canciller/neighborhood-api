const User = require('../models/user.model');
const Permission = require('../models/permission.model');

class UserService {
  async create(doc) {
    return await User.create(new User(doc));
  }

  async update(username, doc) {
    return await User.findOneAndUpdate(
      { username: username },
      { $set: doc },
      { new: true });
  }

  async updateById(id, doc) {
    return await User.findByIdAndUpdate(
      id,
      { $set: doc },
      { new: true });
  }

  async get(username) {
    return await User.findOne({ $or: [
      { username: username },
      { email: username }
    ]});
  }

  async verify(username) {
    return await this.update(username, {
      isVerified: true
    });
  }

  async verifyById(id) {
    return await this.updateById(id, {
      isVerified: true
    });
  }

  async getById(id)
  {
    return await User.findById(id);
  }

  async delete(username) {
    return await User.findOneAndRemove({ username: username });
  }

  async list(query) {
    return await User.list(query);
  }

  async exists(username) {
    return await User.exists({ username: username });
  }

  async getPermission(username, resource)
  {
    var user = await this.get(username);
    if(!user) return null;

    var permission = await Permission.findOne({ role: user.role, resource: resource });
    if(!permission) return null;

    return permission;
  }
}

module.exports = new UserService;