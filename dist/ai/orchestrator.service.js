"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const LANG_PROMPTS = {
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
let OrchestratorService = class OrchestratorService {
    constructor() {
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    async processCommand(command, companyId, lang = 'fr-FR') {
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
    detectIntent(command) {
        if (command.match(/document|fichier|pdf|scan|ocr|analyse|file|ملف|وثيقة/i))
            return 'document';
        if (command.match(/facture|invoice|paiement|client|فاتورة|دفع/i))
            return 'finance';
        if (command.match(/contrat|legal|clause|عقد/i))
            return 'legal';
        return 'general';
    }
};
exports.OrchestratorService = OrchestratorService;
exports.OrchestratorService = OrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OrchestratorService);
//# sourceMappingURL=orchestrator.service.js.map