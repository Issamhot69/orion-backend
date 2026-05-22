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
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
let WhatsappService = class WhatsappService {
    constructor() {
        const twilio = require('twilio');
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    async sendMessage(to, message) {
        return this.client.messages.create({
            from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
            to: 'whatsapp:' + to,
            body: message,
        });
    }
    async sendInvoice(to, invoiceData) {
        const message = `
*ORION AI OS — Facture générée*

Client: ${invoiceData.clientName}
Montant: ${invoiceData.amount} ${invoiceData.currency || 'MAD'}
Date: ${invoiceData.date}
${invoiceData.description ? 'Description: ' + invoiceData.description : ''}

_Généré automatiquement par ORION AI OS_
    `.trim();
        return this.sendMessage(to, message);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map