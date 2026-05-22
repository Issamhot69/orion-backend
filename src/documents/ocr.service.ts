import { Injectable } from '@nestjs/common';

@Injectable()
export class OcrService {
  async extractText(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      try {
        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        return text;
      } catch (e) {
        return buffer.toString('utf-8');
      }
    }
    return buffer.toString('utf-8');
  }
}
