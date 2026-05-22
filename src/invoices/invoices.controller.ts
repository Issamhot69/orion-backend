import { Controller, Post, Body, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoiceService) {}

  @Post('generate')
  async generate(@Body() body: any, @Res() res: Response) {
    const filepath = await this.invoiceService.generatePDF(body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="facture_orion.pdf"');
    fs.createReadStream(filepath).pipe(res);
  }
}
