import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class DocumentAgent {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async process(command: string, companyId: string) {
    return { agent: 'document', status: 'ready', companyId };
  }

  async summarize(text: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Résume ce document en français de façon structurée. Extrais: montants, dates, noms, références importantes.\n\nDocument:\n${text}`
      }]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  async extractInvoiceData(text: string) {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extrais les données de facturation de ce document. Réponds UNIQUEMENT en JSON avec ces champs: clientName, amount, currency, date, description, items[].
        
Document:\n${text}

JSON:`
      }]
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}';
    try { return JSON.parse(raw); }
    catch { return {}; }
  }
}
