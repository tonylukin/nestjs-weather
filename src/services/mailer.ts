import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class Mailer {
  private transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  sendMail = (subject: string, text: string) => {
    return this.transporter.sendMail({
      from: process.env.NOTIFICATION_EMAIL_FROM,
      to: process.env.NOTIFICATION_EMAIL,
      subject: subject,
      text: text,
    });
  };
}
