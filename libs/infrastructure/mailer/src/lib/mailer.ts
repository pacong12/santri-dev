import nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

export interface IMailerService {
  sendMail(options: SendMailOptions): Promise<void>;
}

export class SmtpMailerService implements IMailerService {
  private transporter: nodemailer.Transporter;

  constructor(config: { host: string; port: number; secure: boolean; auth: { user: string; pass: string } }) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: options.from || process.env['MAIL_FROM'] || '"SaaS Pesantren" <noreply@pesantrensaas.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}

export class MockMailerService implements IMailerService {
  private sentMails: SendMailOptions[] = [];

  async sendMail(options: SendMailOptions): Promise<void> {
    this.sentMails.push(options);
    console.log(`[MockMailer] Sent email to ${options.to}: ${options.subject}`);
  }

  getSentMails(): SendMailOptions[] {
    return this.sentMails;
  }

  clear(): void {
    this.sentMails = [];
  }
}
