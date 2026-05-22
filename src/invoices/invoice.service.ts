import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoiceService {
  async generatePDF(invoiceData: any): Promise<string> {
    const PDFDocument = require('pdfkit');
    const outputDir = path.join(process.env.HOME, 'Documents', 'ORION', 'factures');
    fs.mkdirSync(outputDir, { recursive: true });
    const filename = `facture_${Date.now()}.pdf`;
    const filepath = path.join(outputDir, filename);
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fillColor('#4A3DB5').fontSize(28).text('ORION AI OS', 50, 50);
      doc.fillColor('#333').fontSize(12).text('Système de facturation intelligent', 50, 85);
      doc.moveTo(50, 105).lineTo(550, 105).strokeColor('#4A3DB5').stroke();
      doc.fillColor('#1A1A2E').fontSize(22).text('FACTURE', 50, 125);
      doc.fontSize(11).fillColor('#666')
        .text('Date: ' + (invoiceData.date || new Date().toLocaleDateString('fr-FR')), 50, 155)
        .text('N: ORION-' + Date.now(), 50, 172);
      doc.fillColor('#4A3DB5').fontSize(13).text('CLIENT', 50, 210);
      doc.fillColor('#333').fontSize(12).text(invoiceData.clientName || 'Client', 50, 228);
      doc.moveTo(50, 270).lineTo(550, 270).strokeColor('#EEE').stroke();
      doc.fillColor('#4A3DB5').fontSize(11).text('DESCRIPTION', 50, 282).text('MONTANT', 450, 282);
      doc.moveTo(50, 300).lineTo(550, 300).strokeColor('#EEE').stroke();
      doc.fillColor('#333').fontSize(11)
        .text(invoiceData.description || 'Prestation de services', 50, 312)
        .text((invoiceData.amount || 0) + ' ' + (invoiceData.currency || 'MAD'), 450, 312);
      doc.moveTo(50, 340).lineTo(550, 340).strokeColor('#EEE').stroke();
      doc.fillColor('#4A3DB5').fontSize(16).text('TOTAL: ' + (invoiceData.amount || 0) + ' ' + (invoiceData.currency || 'MAD'), 350, 360);
      doc.moveTo(50, 700).lineTo(550, 700).strokeColor('#4A3DB5').stroke();
      doc.fillColor('#999').fontSize(10).text('Généré par ORION AI OS', 50, 715, { align: 'center' });
      doc.end();
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }
}
