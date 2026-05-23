import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendDocument(to: string, subject: string, message: string, attachmentPath?: string) {
    const attachments: any[] = [];

    if (attachmentPath && fs.existsSync(attachmentPath)) {
      const fileContent = fs.readFileSync(attachmentPath);
      attachments.push({
        filename: attachmentPath.split('/').pop(),
        content: fileContent,
      });
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
            <p style="color:#666;font-size:11px;margin:0;">Powered by ORION AI OS — Le premier OS d'entreprise mondial</p>
          </div>
        </div>
      `,
      attachments,
    });

    return { success: true, message: `Email envoyé à ${to}`, id: result.data?.id };
  }

  async sendInvoice(to: string, clientName: string, amount: number, currency: string, pdfPath: string) {
    return this.sendDocument(
      to,
      `Votre facture — ${amount} ${currency}`,
      `Bonjour ${clientName},<br><br>Veuillez trouver ci-joint votre facture d'un montant de <strong>${amount} ${currency}</strong>.<br><br>Merci pour votre confiance.<br><br>Cordialement,<br><strong>ORION AI OS</strong>`,
      pdfPath
    );
  }

  async sendCV(to: string, name: string, pdfPath: string) {
    return this.sendDocument(
      to,
      `CV de ${name} — ORION AI OS`,
      `Bonjour,<br><br>Veuillez trouver ci-joint le CV de <strong>${name}</strong>.<br><br>Cordialement`,
      pdfPath
    );
  }

  async sendCatalogue(to: string, businessName: string, pdfPath: string) {
    return this.sendDocument(
      to,
      `Catalogue ${businessName} — ORION AI OS`,
      `Bonjour,<br><br>Veuillez trouver ci-joint le catalogue de <strong>${businessName}</strong>.<br><br>Cordialement`,
      pdfPath
    );
  }
}
