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
exports.DocumentAgent = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
let DocumentAgent = class DocumentAgent {
    constructor() {
        this.client = new sdk_1.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    async process(command, companyId) {
        return { agent: 'document', status: 'ready', companyId };
    }
    async summarize(text) {
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
    async extractInvoiceData(text) {
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
        try {
            return JSON.parse(raw);
        }
        catch {
            return {};
        }
    }
};
exports.DocumentAgent = DocumentAgent;
exports.DocumentAgent = DocumentAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DocumentAgent);
//# sourceMappingURL=document.agent.js.map