import { vi, describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';
import { SmtpMailerService, MockMailerService } from './mailer.js';

vi.mock('nodemailer', () => {
  const mockTransporter = {
    sendMail: vi.fn().mockResolvedValue({ messageId: '12345' }),
  };
  return {
    default: {
      createTransport: vi.fn().mockReturnValue(mockTransporter),
    },
  };
});

describe('Mailer Infrastructure Services', () => {
  describe('SmtpMailerService', () => {
    it('should initialize transporter and send email correctly', async () => {
      const config = {
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: { user: 'user', pass: 'pass' },
      };

      const mailer = new SmtpMailerService(config);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(config);

      const mockTransporter = (nodemailer.createTransport as any).mock.results[0].value;

      await mailer.sendMail({
        to: 'target@example.com',
        subject: 'Welcome',
        text: 'Hello test',
        from: '"Custom Sender" <custom@sender.com>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Custom Sender" <custom@sender.com>',
        to: 'target@example.com',
        subject: 'Welcome',
        text: 'Hello test',
        html: undefined,
      });
    });
  });

  describe('MockMailerService', () => {
    it('should correctly capture emails in memory', async () => {
      const mailer = new MockMailerService();

      await mailer.sendMail({
        to: 'user1@example.com',
        subject: 'Test Mock 1',
        text: 'Content 1',
      });

      await mailer.sendMail({
        to: 'user2@example.com',
        subject: 'Test Mock 2',
        text: 'Content 2',
      });

      const sent = mailer.getSentMails();
      expect(sent).toHaveLength(2);
      expect(sent[0].to).toBe('user1@example.com');
      expect(sent[1].to).toBe('user2@example.com');

      mailer.clear();
      expect(mailer.getSentMails()).toHaveLength(0);
    });
  });
});
