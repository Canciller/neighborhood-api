const QR = require('../models/qr.model');
const UserService = require('../services/user.service');

class QrService {
  async create(doc) {
    return await QR.create(new QR(doc));
  }

  async getById(id) {
    return await QR.findById(id).populate('user');
  }

  async get(username) {
    return await QR.findOne({
      user: await UserService.get(username),
    }).populate('user');
  }

  async getAllActiveQR() {
    return await QR.find({
      isActive: { $all: true },
    }).populate('user');
  }

  async blockQR(id) {
    return await QR.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async unblockQR(id) {
    return await QR.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true }
    );
  }

  async regenerateQR(id, qr) {
    return await QR.findByIdAndUpdate(
      id,
      { $set: { isActive: true, code: qr } },
      { new: true }
    );
  }

  async getAll() {
    return await QR.find().populate('user');
  }
}

module.exports = new QrService();
