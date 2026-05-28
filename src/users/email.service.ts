import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== 're_123') {
      this.resend = new Resend(apiKey);
    } else {
      console.log('Email service: RESEND_API_KEY not configured');
    }
  }

  async sendDocument(to: string, subject: string, message: string, attachmentPath?: string) {
    if (!this.resend) {
      console.log('Email not sent — RESEND_API_KEY missing');
      return { success: false, message: 'Email service not configured' };
    }

    const attachments: any[] = [];
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      const fileContent = fs.readFileSync(attachmentPath);
      attachments.push({ filename: attachmentPath.split('/').pop(), content: fileContent });
    }

    const result = await this.resend.emails.send({
      from: 'ORION AI OS <onboarding@resend.dev>',
      to,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1A1A2E;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#4A3DB5;margin:0;font-size:28px;">ORION</h1>
            <p style="color:#AAAACC;margin:8px 0 0;font-size:13px;">AI OS — Document généré par intelligence artificielle</p>
          </div>
          <div style="padding:30px;background:#F8F8FF;border:1px solid #EEE;">
            <p style="color:#333;font-size:15px;line-height:1.7;">${message}</p>
          </div>
          <div style="padding:16px;background:#1A1A2E;text-align:center;border-radius:0 0 12px 12px;">
            <p style="color:#666;font-size:11px;margin:0;">Powered by ORION AI OS</p>
          </div>
        </div>
      `,
      attachments,
    });

    return { success: true, message: `Email envoyé à ${to}`, id: result.data?.id };
  }

  async sendInvoice(to: string, clientName: string, amount: number, currency: string, pdfPath: string) {
    return this.sendDocument(to, `Invoice — ${amount} ${currency}`,
      `Dear ${clientName},<br><br>Please find your invoice for <strong>${amount} ${currency}</strong>.<br><br>Best regards,<br><strong>ORION AI OS</strong>`, pdfPath);
  }
}
