import { Injectable } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { Ollama } from 'ollama';

@Injectable()
export class DocumentsService {
  private ollama: Ollama;

  constructor(private ocrService: OcrService) {
    this.ollama = new Ollama({ host: 'http://localhost:11434' });
  }

  async processUpload(file: any, companyId: string) {
    const text = await this.ocrService.extractText(file.buffer, file.mimetype);

    const summary = await this.summarize(text);
    const invoiceData = await this.extractInvoiceData(text);

    return {
      filename: file.originalname,
      size: file.size,
      text: text.substring(0, 500),
      summary,
      invoiceData,
      companyId,
      processedAt: new Date(),
    };
  }

  private async summarize(text: string): Promise<string> {
    const response = await this.ollama.chat({
      model: 'llama3.2',
      messages: [{
        role: 'user',
        content: `Tu es ORION. Résume ce document en français en 3 points clés maximum. Sois concis et professionnel.\n\nDocument:\n${text.substring(0, 2000)}`
      }]
    });
    return response.message.content;
  }

  private async extractInvoiceData(text: string): Promise<any> {
    const response = await this.ollama.chat({
      model: 'llama3.2',
      messages: [{
        role: 'user',
        content: `Extrais les données de facturation de ce document. Réponds UNIQUEMENT en JSON valide avec ces champs: {"clientName":"","amount":0,"currency":"MAD","date":"","description":"","items":[]}.
        
Document:\n${text.substring(0, 2000)}

JSON uniquement, rien d'autre:`
      }]
    });

    try {
      const raw = response.message.content;
      const match = raw.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : {};
    } catch {
      return {};
    }
  }
}
