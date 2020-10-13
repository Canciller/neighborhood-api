const UserService = require('./user.service');
const MailerService = require('./mailer.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const EmailVerification = require('../models/emailVerification.model');

class AuthService {

  generateJwtToken(payload)
  {
    return jwt.sign(payload, config.jwtSecret);
  }

  generateEmailVerificationCode() {
    return crypto.randomBytes(64).toString('hex');
  }

  async signIn({
    username,
    password,
  }) {
    const user = await UserService.get(username);
    if(!user) return null;

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) return null;

    const payload = user.toJSON();

    const token = this.generateJwtToken(payload);

    return {
      token,
      ...payload
    }
  }

  async signUp({
    username,
    email,
    password
  }) {
    const created = await UserService.create({
      username,
      email,
      password
    });

    return created;
  }

  async verify(code)
  {
    const emailVerification = await EmailVerification.findOneAndDelete({ code });

    if(!emailVerification) return false

    const user = await UserService.verifyById(emailVerification.user);
    if(!user) return false;

    return true;
  }

  async sendEmailVerification({
    baseUrl,
    userId
  })
  {
    const emailVerification = await EmailVerification.findOneAndUpdate(
      {
        user: userId
      },
      {
        code: this.generateEmailVerificationCode()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true })
      .populate('user');

    if(!emailVerification) return null;

    const verificationUrl = `${baseUrl}/${emailVerification.code}`;

    await MailerService.sendMail({
      to: emailVerification.user.email,
      html: `
        <a target="_blank" href="${verificationUrl}">${verificationUrl}</a>
      `
    });

    return emailVerification;
  }
}

module.exports = new AuthService;