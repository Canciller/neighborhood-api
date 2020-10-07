const UserService = require('./user.service');
const MailerService = require('./mailer.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

//const RefreshToken = require('../models/refreshToken.model');
const EmailVerification = require('../models/emailVerification.model');
const { base } = require('../models/emailVerification.model');

class AuthService {
  /*
  generateRefreshToken(userId, ipAddress)
  {
    const token = crypto.randomBytes(40).toString('hex');

    // Expires in 7 days
    return new RefreshToken({
      user: userId,
      token: token,
      expires: new Date(Date.now() + 7*24*60*60*1000),
      createdByIp: ipAddress,
    });
  }

  async getRefreshTokens(userId)
  {
    var found = await UserService.getById(userId);
    if(!found) return null

    return await RefreshToken.find({ user: userId });
  }

  async getRefreshToken(token)
  {
    var refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if(!refreshToken || !refreshToken.isActive) return null
    return refreshToken;
  }

  async refreshToken({
    token,
    ipAddress
  }) {
    const refreshToken = await this.getRefreshToken(token);
    if(!refreshToken) return null;

    const { user } = refreshToken;

    const newRefreshToken = this.generateRefreshToken(user, ipAddress);

    refreshToken.isActive = false;
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replaceByToken = newRefreshToken.token;

    await refreshToken.save();
    await newRefreshToken.save();

    const payload = user.toJSON();
    const newToken = this.generateJwtToken(payload);

    return {
      token: newToken,
      refreshToken: newRefreshToken.token,
      ...payload
    }
  }
  */

  generateJwtToken(payload)
  {
    return jwt.sign(payload, config.jwtSecret, {
      //expiresIn: '15m'
    });
  }

  generateEmailVerificationCode() {
    return crypto.randomBytes(64).toString('hex');
  }

  async signIn({
    username,
    password,
    //ipAddress,
  }) {
    const user = await UserService.get(username);
    if(!user) return null;

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect) return null;

    const payload = user.toJSON();

    const token = this.generateJwtToken(payload);

    /*
    const refreshToken = this.generateRefreshToken(user.id, ipAddress);
    await refreshToken.save();
    */

    return {
      token,
      //refreshToken: refreshToken.token,
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