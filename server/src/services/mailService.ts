import nodemailer from 'nodemailer';
import logger from '../utils/logger';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'איפוס סיסמה',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>איפוס סיסמה</h2>
          <p>קיבלנו בקשה לאיפוס הסיסמה שלך. אם זו לא הייתה את, התעלמי מהמייל.</p>
          <a href="${resetUrl}" 
             style="display: inline-block; 
                    background-color: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px;">
            איפוס סיסמה
          </a>
          <p>קישור זה יפוג תוך 1 שעה.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
      return true;
    } catch (error) {
      logger.error('Error sending email', error);
      throw new Error('שליחת מייל נכשלה');
    }
  }
}

export const mailService = new MailService();
