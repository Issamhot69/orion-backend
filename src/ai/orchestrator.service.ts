import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

const LANG_PROMPTS: any = {
  'ar-MA': 'أنت ORION نظام ذكاء اصطناعي. تحدث العربية فقط بدون استثناء.',
  'fr-FR': 'Tu es ORION. Réponds uniquement en français.',
  'en-US': 'You are ORION. Respond only in English.',
  'es-ES': 'Eres ORION. Responde solo en español.',
  'ja-JP': 'あなたはORIONです。日本語のみで答えてください。',
  'ru-RU': 'Вы ORION. Отвечайте только на русском.',
  'de-DE': 'Du bist ORION. Antworte nur auf Deutsch.',
  'it-IT': 'Sei ORION. Rispondi solo in italiano.',
  'pt-BR': 'Você é ORION. Responda apenas em português.',
  'zh-CN': '你是ORION。只用中文回答。',
  'ko-KR': '당신은 ORION입니다. 한국어로만 답하세요.',
  'hi-IN': 'आप ORION हैं। केवल हिंदी में उत्तर दें।',
  'tr-TR': 'Sen ORION\'sun. Sadece Türkçe cevap ver.',
  'nl-NL': 'Jij bent ORION. Antwoord alleen in het Nederlands.',
  'pl-PL': 'Jesteś ORION. Odpowiadaj tylko po polsku.',
  'uk-UA': 'Ви ORION. Відповідайте лише українською.',
  'fa-IR': 'شما ORION هستید. فقط به فارسی پاسخ دهید.',
  'he-IL': 'אתה ORION. ענה רק בעברית.',
  'vi-VN': 'Bạn là ORION. Chỉ trả lời bằng tiếng Việt.',
  'th-TH': 'คุณคือORION ตอบเป็นภาษาไทยเท่านั้น',
  'id-ID': 'Anda ORION. Jawab hanya dalam Bahasa Indonesia.',
  'sv-SE': 'Du är ORION. Svara bara på svenska.',
};

@Injectable()
export class OrchestratorService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async processCommand(command: string, companyId: string, lang: string = 'fr-FR') {
    const intent = this.detectIntent(command);
    const systemPrompt = LANG_PROMPTS[lang] || 'You are ORION. Respond in the same language as the user.';

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: command }
      ],
      max_tokens: 512,
    });

    const message = response.choices[0]?.message?.content || '';
    return { agent: intent, message, intent, companyId, lang };
  }

  private detectIntent(command: string): string {
    if (command.match(/document|fichier|pdf|scan|ocr|analyse|file|ملف|وثيقة/i)) return 'document';
    if (command.match(/facture|invoice|paiement|client|فاتورة|دفع/i)) return 'finance';
    if (command.match(/contrat|legal|clause|عقد/i)) return 'legal';
    return 'general';
  }
}
