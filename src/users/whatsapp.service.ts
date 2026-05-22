import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private client: any;

  constructor() {
    const twilio = require('twilio');
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendMessage(to: string, message: string): Promise<any> {
    return this.client.messages.create({
      from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
      to: 'whatsapp:' + to,
      body: message,
    });
  }

  async sendInvoice(to: string, invoiceData: any): Promise<any> {
    const message = `
*ORION AI OS — Facture générée*

Client: ${invoiceData.clientName}
Montant: ${invoiceData.amount} ${invoiceData.currency || 'MAD'}
Date: ${invoiceData.date}
${invoiceData.description ? 'Description: ' + invoiceData.description : ''}

_Généré automatiquement par ORION AI OS_
    `.trim();

    return this.sendMessage(to, message);
  }
}
