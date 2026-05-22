"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let InvoiceService = class InvoiceService {
    async generatePDF(invoiceData) {
        const PDFDocument = require('pdfkit');
        const outputDir = path.join(process.env.HOME, 'Documents', 'ORION', 'factures');
        fs.mkdirSync(outputDir, { recursive: true });
        const filename = `facture_${Date.now()}.pdf`;
        const filepath = path.join(outputDir, filename);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);
            doc.fillColor('#4A3DB5').fontSize(28).text('ORION AI OS', 50, 50);
            doc.fillColor('#333').fontSize(12).text('Système de facturation intelligent', 50, 85);
            doc.moveTo(50, 105).lineTo(550, 105).strokeColor('#4A3DB5').stroke();
            doc.fillColor('#1A1A2E').fontSize(22).text('FACTURE', 50, 125);
            doc.fontSize(11).fillColor('#666')
                .text('Date: ' + (invoiceData.date || new Date().toLocaleDateString('fr-FR')), 50, 155)
                .text('N: ORION-' + Date.now(), 50, 172);
            doc.fillColor('#4A3DB5').fontSize(13).text('CLIENT', 50, 210);
            doc.fillColor('#333').fontSize(12).text(invoiceData.clientName || 'Client', 50, 228);
            doc.moveTo(50, 270).lineTo(550, 270).strokeColor('#EEE').stroke();
            doc.fillColor('#4A3DB5').fontSize(11).text('DESCRIPTION', 50, 282).text('MONTANT', 450, 282);
            doc.moveTo(50, 300).lineTo(550, 300).strokeColor('#EEE').stroke();
            doc.fillColor('#333').fontSize(11)
                .text(invoiceData.description || 'Prestation de services', 50, 312)
                .text((invoiceData.amount || 0) + ' ' + (invoiceData.currency || 'MAD'), 450, 312);
            doc.moveTo(50, 340).lineTo(550, 340).strokeColor('#EEE').stroke();
            doc.fillColor('#4A3DB5').fontSize(16).text('TOTAL: ' + (invoiceData.amount || 0) + ' ' + (invoiceData.currency || 'MAD'), 350, 360);
            doc.moveTo(50, 700).lineTo(550, 700).strokeColor('#4A3DB5').stroke();
            doc.fillColor('#999').fontSize(10).text('Généré par ORION AI OS', 50, 715, { align: 'center' });
            doc.end();
            stream.on('finish', () => resolve(filepath));
            stream.on('error', reject);
        });
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)()
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map