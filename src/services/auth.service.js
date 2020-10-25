const UserService = require('./user.service');
const MailerService = require('./mailer.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const EmailVerification = require('../models/emailVerification.model');

class AuthService {
  /**
   * Generate JWT token.
   * @param {Object} payload - JWT token payload.
   */
  generateJwtToken(payload) {
    return jwt.sign(payload, config.jwtSecret);
  }

  /**
   * Generate email verification code.
   */
  generateEmailVerificationCode() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Get myself.
   * @param {string} id - User ID.
   */
  async myself(id) {
    const user = await UserService.getById(id);
    if (!user) return null;

    const payload = user.toJSON();

    const token = this.generateJwtToken(payload);

    return {
      token,
      ...payload,
    };
  }

  /**
   * Sign in.
   * @param {Object} param
   * @param {string} param.username
   * @param {string} param.password
   */
  async signIn({ username, password }) {
    const user = await UserService.get(username);
    if (!user) return null;

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) return null;

    const payload = user.toJSON();

    const token = this.generateJwtToken(payload);

    return {
      token,
      ...payload,
    };
  }

  /**
   * Sign up.
   * @param {Object} param
   * @param {string} param.username
   * @param {string} param.email
   * @param {string} param.name
   * @param {string} param.password
   */
  async signUp({ username, email, name, password }) {
    const created = await UserService.create({
      username,
      email,
      name,
      password,
    });

    return created;
  }

  /**
   * Verify email.
   * @param {string} code - Email verification code.
   */
  async verify(code) {
    const emailVerification = await EmailVerification.findOneAndDelete({
      code,
    });

    if (!emailVerification) return false;

    const user = await UserService.verifyById(emailVerification.user);
    if (!user) return false;

    return true;
  }

  /**
   * Send email verification to user with id equal to userId.
   * @param {string} userId - User ID.
   * @param {string} verificationEndpoint - Email verification HTTP endpoint.
   */
  async sendEmailVerification(userId, verificationEndpoint) {
    if (!verificationEndpoint)
      throw new Error('verificationEndpoint is undefined.');

    const emailVerification = await EmailVerification.findOneAndUpdate(
      {
        user: userId,
      },
      {
        code: this.generateEmailVerificationCode(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('user');

    if (!emailVerification) return null;

    const url = `${config.api.url}${config.api.prefix}`;
    const verificationUrl = `${url}${verificationEndpoint}/${emailVerification.code}`;

    await MailerService.sendMail({
      to: emailVerification.user.email,
      html: `
        <a target="_blank" href="${verificationUrl}">${verificationUrl}</a>
      `,
    });

    return emailVerification;
  }
}

module.exports = new AuthService();
