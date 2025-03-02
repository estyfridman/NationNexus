import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import {EMAIL_TEMPLATES, APP_CONFIG, MSG_FUNC, TEXT, MESSAGES} from '../constants';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: TEXT.SERVICE_MAIL,
      auth: {
        user: APP_CONFIG.EMAIL_USER,
        pass: APP_CONFIG.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const mailOptions = {
      from: APP_CONFIG.EMAIL_USER,
      to: email,
      subject: EMAIL_TEMPLATES.PASSWORD_RESET_SUBJECT,
      html: EMAIL_TEMPLATES.PASSWORD_RESET_HTML(MSG_FUNC.RESET_URL(resetToken)),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(MSG_FUNC.EMAIL_INFO(info.response));
      return true;
    } catch (error) {
      logger.error(MESSAGES.ERR_EMAIL, error);
      throw new Error(MESSAGES.EMAIL_FAILED);
    }
  }
}

export const mailService = new MailService();
