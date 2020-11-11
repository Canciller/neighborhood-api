const crypto = require('crypto');
const QRCode = require('qrcode');
const QR = require('../models/qr.model');
const UserService = require('../services/user.service');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../config');

// TODO: Maybe user needs to be populated.
// TODO: Create test for QRService.list.

class QRService {
  /**
   * Generate QR payload.
   * @param {string} user - User ID.
   * @param {string} code - Generated code.
   * @returns {string}
   */
  generatePayload(user, code) {
    return `${config.api.url}${config.api.prefix}/qr/match/${user}/${code}`;
  }

  /**
   * Generate unique code.
   * @returns {string}
   */
  generateCode() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate QR image.
   * @param {string} payload
   */
  async generateQRImageWithPayload(payload) {
    return await QRCode.toDataURL(payload);
  }

  /**
   * Generate QR image with user and code.
   * @param {string} user - User ID.
   * @param {string} code - Generated Code.
   */
  async generateQRImage(user, code) {
    return await QRCode.toDataURL(this.generatePayload(user, code));
  }

  /**
   * Check if user exists and if QR exists for that user.
   * @param {string} user - User ID.
   * @returns {boolean}
   */
  async exists(user) {
    if (ObjectId.isValid(user))
      return await QR.exists({
        user: user,
      });

    return false;
  }

  /**
   * Get QR for user.
   * @param {string} user - User ID.
   */
  async get(user) {
    if (ObjectId.isValid(user))
      return await QR.findOne({
        user: user,
      }).populate('user');

    return null;
  }

  /**
   * List QR.
   * @param {Object} query
   * @param {number} query.skip - Number of QR to be skipped.
   * @param {number} query.limit - Limit number of QR to be returned.
   * @param {enabled} query.enabled
   */
  async list({ skip = 0, limit = 100, enabled } = {}) {
    let query = {};

    if (enabled !== undefined) query.enabled = enabled;

    return await QR.find(query)
      .populate('user')
      .sort({
        createdAt: -1,
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }

  /**
   * Create QR with user.
   * @param {string} user - User ID.
   * @param {Object} doc
   */
  async create(user, doc = {}) {
    delete doc.user;

    const exist = await UserService.existsById(user);

    if (exist && ObjectId.isValid(user)) {
      const qr = new QR({
        ...doc,
        user: user,
      });

      (await qr.save()).populate('user');

      return qr;
    }

    return null;
  }

  /**
   * Update QR with user.
   * @param {string} user - User ID.
   * @param {object} doc
   */
  async update(user, doc = {}) {
    delete doc.user;

    if (ObjectId.isValid(user))
      return await QR.findOneAndUpdate(
        { user: user },
        { $set: doc },
        { new: true }
      ).populate('user');

    return null;
  }

  /**
   * Generate QR for user.
   * When QR exists update with new code.
   * When QR doesn't exist create with new code.
   * @param {string} user - User ID.
   */
  async generate(user) {
    let exists = await this.exists(user);

    const code = this.generateCode();
    const image = await this.generateQRImage(user, code);

    let qr = null;
    const doc = {
      code,
      image,
    };

    if (exists) qr = await this.update(user, doc);
    else qr = await this.create(user, doc);

    return qr;
  }

  /**
   * Delete QR for user.
   * @param {string} user - User ID.
   */
  async delete(user) {
    if (ObjectId.isValid(user))
      return await QR.findOneAndDelete({
        user: user,
      }).populate('user');

    return null;
  }

  /**
   * Match QR with code for user and check if enabled.
   * @param {string} user - User ID.
   * @param {string} code - Passed code.
   */
  async match(user, code) {
    const found = await this.get(user);
    return found !== null && found.isCodeCorrect(code);
  }

  /**
   * Enable QR for user.
   * @param {string} user - User ID.
   */
  async enable(user) {
    return await this.update(user, {
      enabled: true,
    });
  }

  /**
   * Disable QR for user.
   * @param {string} user - User ID.
   */
  async disable(user) {
    return await this.update(user, {
      enabled: false,
    });
  }
}

module.exports = new QRService();
