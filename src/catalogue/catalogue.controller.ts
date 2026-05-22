import { Controller, Post, Body, Res } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import * as path from 'path';

@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Post('generate')
  async generate(@Body() body: any) {
    return this.catalogueService.generateCatalogue(body);
  }

  @Post('pdf')
  async generatePDF(@Body() body: any, @Res() res: Response) {
    const catalogueData = await this.catalogueService.generateCatalogue(body);

    // Générer QR code
    const qrText = `ORION AI OS - ${body.name} - Catalogue généré le ${new Date().toLocaleDateString('fr-FR')}`;
    const qrPath = path.join('/tmp', `qr_${Date.now()}.png`);
    await QRCode.toFile(qrPath, qrText, {
      width: 150, margin: 1,
      color: { dark: '#4A3DB5', light: '#FFFFFF' }
    });

    catalogueData['qrPath'] = qrPath;
    const filepath = await this.catalogueService.generateCataloguePDF(catalogueData);

    // Cleanup QR
    try { fs.unlinkSync(qrPath); } catch {}

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="catalogue_orion.pdf"');
    fs.createReadStream(filepath).pipe(res);
  }
}
