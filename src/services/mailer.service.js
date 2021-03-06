const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * MailerService class.
 */
class MailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.mailer.service,
      auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass,
      },
    });
  }

  /**
   * Send email.
   * @param {Object} options
   */
  async sendMail(options) {
    var mailOptions = {};
    if (options instanceof Object) mailOptions = options;

    if (!mailOptions.from) mailOptions.from = config.mailer.auth.user;

    if (!mailOptions.subject) mailOptions.subject = config.appName;

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new MailerService();
