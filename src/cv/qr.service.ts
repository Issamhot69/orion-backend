import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';

@Injectable()
export class QrService {
  async generateQR(text: string): Promise<string> {
    const outputPath = path.join('/tmp', `qr_${Date.now()}.png`);
    await QRCode.toFile(outputPath, text, {
      width: 200,
      margin: 1,
      color: { dark: '#4A3DB5', light: '#FFFFFF' },
    });
    return outputPath;
  }
}
