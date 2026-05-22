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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../memory/database.service");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let CatalogueService = class CatalogueService {
    constructor(db) {
        this.db = db;
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    formatPrice(price) {
        if (typeof price === 'string')
            return price;
        if (typeof price === 'number')
            return price.toString();
        if (typeof price === 'object' && price !== null) {
            return Object.entries(price).map(([k, v]) => `${v} ${k}`).join(' / ');
        }
        return '';
    }
    async generateCatalogue(data) {
        const { name, type, description, items, lang = 'fr-FR', companyId = 'company-1' } = data;
        const langNames = {
            'fr-FR': 'français', 'en-US': 'English', 'ar-MA': 'arabe',
            'es-ES': 'español', 'de-DE': 'Deutsch', 'it-IT': 'italiano',
            'ru-RU': 'русский', 'zh-CN': '中文', 'ja-JP': '日本語',
        };
        const langName = langNames[lang] || 'français';
        const itemsSimple = items.map((item) => ({
            name: item.name,
            price: this.formatPrice(item.price)
        }));
        const prompt = `Crée un catalogue en ${langName} pour: ${name} (${type}).
Description: ${description}
Articles: ${itemsSimple.map((i) => `${i.name}: ${i.price}`).join(', ')}

Réponds UNIQUEMENT avec ce JSON valide:
{
  "slogan": "slogan court accrocheur",
  "description": "description 2-3 phrases",
  "items": [{"name": "nom", "price": "prix", "description": "description", "highlight": "point fort"}],
  "callToAction": "phrase action"
}`;
        const response = await this.groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2048,
        });
        const raw = response.choices[0]?.message?.content || '{}';
        let catalogue;
        try {
            const match = raw.match(/\{[\s\S]*\}/);
            catalogue = match ? JSON.parse(match[0]) : {};
            if (catalogue.items) {
                catalogue.items = catalogue.items.map((item, i) => ({
                    ...item,
                    price: this.formatPrice(item.price) || this.formatPrice(itemsSimple[i]?.price) || '',
                }));
            }
        }
        catch {
            catalogue = {};
        }
        return { name, type, lang, catalogue, companyId, createdAt: new Date() };
    }
    async generateCataloguePDF(data) {
        const PDFDocument = require('pdfkit');
        const outputDir = path.join(process.env.HOME, 'Documents', 'ORION', 'catalogues');
        fs.mkdirSync(outputDir, { recursive: true });
        const filename = `catalogue_${Date.now()}.pdf`;
        const filepath = path.join(outputDir, filename);
        const qrPath = data.qrPath;
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 0, size: 'A4' });
            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);
            doc.rect(0, 0, 595, 240).fill('#1A1A2E');
            doc.opacity(1);
            doc.fillColor('white').fontSize(36).text(data.name || '', 0, 70, { align: 'center', width: 595 });
            doc.fillColor('#FAC775').fontSize(14).text(data.catalogue?.slogan || '', 0, 120, { align: 'center', width: 595 });
            doc.fillColor('#4A3DB5').fontSize(11).text(data.type?.toUpperCase() || '', 0, 150, { align: 'center', width: 595 });
            doc.fillColor('#AAAACC').fontSize(9).text('Powered by ORION AI OS', 0, 210, { align: 'center', width: 595 });
            doc.rect(0, 240, 595, 90).fill('#F8F8FF');
            doc.fillColor('#4A3DB5').fontSize(12).text('À PROPOS', 50, 255);
            doc.moveTo(50, 270).lineTo(545, 270).strokeColor('#4A3DB5').lineWidth(1).stroke();
            doc.fillColor('#333').fontSize(10).text(data.catalogue?.description || '', 50, 278, { width: 495, lineGap: 3 });
            let yPos = 350;
            if (data.catalogue?.items) {
                data.catalogue.items.forEach((item, i) => {
                    if (yPos > 680) {
                        doc.addPage();
                        yPos = 30;
                    }
                    doc.rect(0, yPos, 595, 100).fill(i % 2 === 0 ? '#FFFFFF' : '#F5F5FF');
                    doc.rect(25, yPos + 10, 80, 80).fill('#E8E8F0');
                    doc.fillColor('#4A3DB5').fontSize(10).text(item.name?.[0] || 'O', 55, yPos + 42);
                    doc.fillColor('#1A1A2E').fontSize(13).text(item.name || '', 120, yPos + 12);
                    doc.fillColor('#4A3DB5').fontSize(12).text(String(item.price || ''), 120, yPos + 30);
                    doc.fillColor('#555').fontSize(9).text(item.description || '', 120, yPos + 48, { width: 420, lineGap: 2 });
                    if (item.highlight)
                        doc.fillColor('#0F6E56').fontSize(9).text(`* ${item.highlight}`, 120, yPos + 78);
                    doc.moveTo(25, yPos + 98).lineTo(570, yPos + 98).strokeColor('#EEEEEE').lineWidth(0.5).stroke();
                    yPos += 103;
                });
            }
            const ctaY = Math.max(yPos + 20, 700);
            doc.rect(0, ctaY, 595, 100).fill('#1A1A2E');
            if (qrPath && fs.existsSync(qrPath)) {
                try {
                    doc.image(qrPath, 30, ctaY + 15, { width: 70, height: 70 });
                    doc.fillColor('#AAAACC').fontSize(7).text('Scannez pour plus\nd\'informations', 25, ctaY + 88, { width: 80, align: 'center' });
                }
                catch (e) { }
            }
            doc.fillColor('white').fontSize(14).text(data.catalogue?.callToAction || 'Contactez-nous !', 120, ctaY + 25, { width: 360, align: 'center' });
            doc.fillColor('#4A3DB5').fontSize(9).text('Catalogue généré par ORION AI OS', 120, ctaY + 55, { width: 360, align: 'center' });
            doc.fillColor('#333').fontSize(8).text(new Date().toLocaleDateString('fr-FR'), 120, ctaY + 70, { width: 360, align: 'center' });
            doc.end();
            stream.on('finish', () => resolve(filepath));
            stream.on('error', reject);
        });
    }
};
exports.CatalogueService = CatalogueService;
exports.CatalogueService = CatalogueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CatalogueService);
//# sourceMappingURL=catalogue.service.js.map