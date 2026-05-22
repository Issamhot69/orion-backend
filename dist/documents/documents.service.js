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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const ocr_service_1 = require("./ocr.service");
const ollama_1 = require("ollama");
let DocumentsService = class DocumentsService {
    constructor(ocrService) {
        this.ocrService = ocrService;
        this.ollama = new ollama_1.Ollama({ host: 'http://localhost:11434' });
    }
    async processUpload(file, companyId) {
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
    async summarize(text) {
        const response = await this.ollama.chat({
            model: 'llama3.2',
            messages: [{
                    role: 'user',
                    content: `Tu es ORION. Résume ce document en français en 3 points clés maximum. Sois concis et professionnel.\n\nDocument:\n${text.substring(0, 2000)}`
                }]
        });
        return response.message.content;
    }
    async extractInvoiceData(text) {
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
        }
        catch {
            return {};
        }
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ocr_service_1.OcrService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map