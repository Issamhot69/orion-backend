import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send')
  async send(@Body() body: { to: string; subject: string; message: string }) {
    return this.emailService.sendDocument(body.to, body.subject, body.message);
  }

  @Post('send-invoice')
  async sendInvoice(@Body() body: { to: string; clientName: string; amount: number; currency: string }) {
    return this.emailService.sendInvoice(body.to, body.clientName, body.amount, body.currency, '');
  }
}
