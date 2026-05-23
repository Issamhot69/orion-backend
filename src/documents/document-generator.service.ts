import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentGeneratorService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateDocument(type: string, data: any, lang: string = 'fr-FR'): Promise<string> {
    const PDFDocument = require('pdfkit');
    const outputDir = path.join(process.env.HOME || '/tmp', 'Documents', 'ORION', 'documents');
    fs.mkdirSync(outputDir, { recursive: true });
    const filename = `${type}_${Date.now()}.pdf`;
    const filepath = path.join(outputDir, filename);

    const langNames: any = { 'fr-FR': 'français', 'en-US': 'English', 'ar-MA': 'arabe', 'es-ES': 'español', 'de-DE': 'Deutsch' };
    const langName = langNames[lang] || 'français';

    const prompt = `Tu es un expert juridique et commercial. Génère un document professionnel de type "${type}" en ${langName}.
Données: ${JSON.stringify(data)}
Génère un document complet, professionnel et légalement correct. Inclus toutes les clauses nécessaires.
Réponds avec le contenu du document uniquement, formaté proprement avec des sections claires.`;

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || '';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 60, size: 'A4' });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header ORION
      doc.rect(0, 0, 595, 80).fill('#1A1A2E');
      doc.fillColor('#4A3DB5').fontSize(20).text('ORION AI OS', 60, 20);
      doc.fillColor('#AAAACC').fontSize(10).text('Document généré automatiquement par intelligence artificielle', 60, 48);
      doc.fillColor('white').fontSize(14).text(new Date().toLocaleDateString('fr-FR'), 450, 30);

      doc.moveDown(3);

      // Contenu
      doc.fillColor('#1A1A2E').fontSize(11).text(content, 60, 100, {
        width: 475,
        lineGap: 4,
        paragraphGap: 8,
      });

      // Footer
      doc.moveTo(60, 780).lineTo(535, 780).strokeColor('#4A3DB5').lineWidth(0.5).stroke();
      doc.fillColor('#999').fontSize(8).text('Document généré par ORION AI OS — Pour usage professionnel', 60, 790, { align: 'center', width: 475 });

      doc.end();
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }
}
