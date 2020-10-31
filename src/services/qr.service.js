const QRCode = require('qrcode');
const QR = require('../models/qr.model');
const UserService = require('../services/user.service');

class QRService {
  /**
   * Generate QR code for user with userId.
   * @param {string} userId - User ID.
   */
  async generate(userId) {
    const base64Image = await QRCode.toDataURL(userId, {
      type: 'image/jpeg',
      quality: 1,
    });

    return base64Image;

    /*
    return await QR.create(new QR({
      user: userId,
    }))
    */
  }

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

module.exports = new QRService();
