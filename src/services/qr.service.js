const QRCode = require('qrcode');
const QR = require('../models/qr.model');
const UserService = require('../services/user.service');

class QRService {
  /**
   * Generate QR code for user with userId.
   * @param {string} userId - User ID.
   */
  async generate(userId) {
    const url = "http://localhost:8000/api/qrs/user/" + userId
    const base64Image = await QRCode.toDataURL(url, {
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
    if(this.existsById(doc.user)) {
      return await this.regenerateQR(doc.user);
    }
    else return await QR.create(new QR(doc));
  }

  async getById(id) {
    return await QR.findById(id).populate('user');
  }

  async get(username) {
    return await QR.findOne({
      user: await UserService.get(username),
    }).populate('user');
  }

  async getByUserID(id){
    return await QR.findOne({
      user: await UserService.getById(id),
    }).populate('user');
  }

  async existsById(id) {
    return await QR.exists({ _id: id });
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


  async regenerateQR(userID){
    return await QR.findOneAndUpdate(
      {user: userID}, 
      {code : await this.generate(userID)},{
        new: true
      });
  }

  async getAll() {
    return await QR.find().populate('user');
  }
}

module.exports = new QRService();
