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
exports.CvService = void 0;
const common_1 = require("@nestjs/common");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let CvService = class CvService {
    constructor() {
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    async enhanceCV(data) {
        const { name, title, experience, education, skills, lang = 'fr-FR' } = data;
        const langNames = { 'fr-FR': 'français', 'en-US': 'English', 'ar-MA': 'arabe', 'es-ES': 'español' };
        const langName = langNames[lang] || 'français';
        const prompt = `Tu es un expert RH et rédacteur de CV professionnel.
Améliore et enrichis ce CV en ${langName} :

Nom: ${name}
Titre: ${title}
Expériences: ${JSON.stringify(experience)}
Formation: ${JSON.stringify(education)}
Compétences: ${JSON.stringify(skills)}

Réponds UNIQUEMENT avec ce JSON:
{
  "summary": "résumé professionnel accrocheur 3-4 phrases",
  "experience": [{"title": "...", "company": "...", "period": "...", "description": "description enrichie 2-3 phrases", "achievements": ["réalisation 1", "réalisation 2"]}],
  "education": [{"degree": "...", "school": "...", "year": "..."}],
  "skills": {"technical": ["skill1", "skill2"], "soft": ["skill1", "skill2"], "languages": ["langue1", "langue2"]},
  "certifications": []
}`;
        const response = await this.groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2048,
        });
        const raw = response.choices[0]?.message?.content || '{}';
        try {
            const match = raw.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : {};
        }
        catch {
            return {};
        }
    }
    async generateCVPDF(data) {
        const PDFDocument = require('pdfkit');
        const outputDir = path.join(process.env.HOME, 'Documents', 'ORION', 'cv');
        fs.mkdirSync(outputDir, { recursive: true });
        const filename = `cv_${data.name?.replace(/\s/g, '_')}_${Date.now()}.pdf`;
        const filepath = path.join(outputDir, filename);
        const enhanced = await this.enhanceCV(data);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 0, size: 'A4' });
            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);
            doc.rect(0, 0, 190, 842).fill('#1A1A2E');
            doc.circle(95, 100, 55).fill('#4A3DB5');
            doc.fillColor('white').fontSize(32).text(data.name?.[0] || '?', 70, 82);
            doc.fillColor('white').fontSize(14).text(data.name || '', 15, 170, { width: 160, align: 'center' });
            doc.fillColor('#4A3DB5').fontSize(10).text(data.title || '', 15, 192, { width: 160, align: 'center' });
            doc.fillColor('#FAC775').fontSize(9).text('CONTACT', 20, 230);
            doc.moveTo(20, 242).lineTo(170, 242).strokeColor('#4A3DB5').lineWidth(0.5).stroke();
            if (data.email)
                doc.fillColor('#AAAACC').fontSize(8).text(`Email: ${data.email}`, 20, 250);
            if (data.phone)
                doc.fillColor('#AAAACC').fontSize(8).text(`Tel: ${data.phone}`, 20, 265);
            if (data.location)
                doc.fillColor('#AAAACC').fontSize(8).text(`Ville: ${data.location}`, 20, 280);
            if (data.linkedin)
                doc.fillColor('#AAAACC').fontSize(8).text(`in ${data.linkedin}`, 20, 295);
            doc.fillColor('#FAC775').fontSize(9).text('COMPÉTENCES', 20, 330);
            doc.moveTo(20, 342).lineTo(170, 342).strokeColor('#4A3DB5').lineWidth(0.5).stroke();
            let skillY = 350;
            const allSkills = (enhanced.skills?.technical || data.skills || []).slice(0, 10);
            allSkills.forEach((skill) => {
                doc.fillColor('#AAAACC').fontSize(8).text(`• ${skill}`, 20, skillY);
                skillY += 14;
            });
            if (enhanced.skills?.languages?.length > 0) {
                skillY += 10;
                doc.fillColor('#FAC775').fontSize(9).text('LANGUES', 20, skillY);
                skillY += 14;
                enhanced.skills.languages.forEach((lang) => {
                    doc.fillColor('#AAAACC').fontSize(8).text(`• ${lang}`, 20, skillY);
                    skillY += 14;
                });
            }
            if (enhanced.skills?.soft?.length > 0) {
                skillY += 10;
                doc.fillColor('#FAC775').fontSize(9).text('QUALITÉS', 20, skillY);
                skillY += 14;
                enhanced.skills.soft.slice(0, 5).forEach((skill) => {
                    doc.fillColor('#AAAACC').fontSize(8).text(`• ${skill}`, 20, skillY);
                    skillY += 14;
                });
            }
            doc.fillColor('#333').fontSize(7).text('ORION AI OS', 20, 810, { width: 160, align: 'center' });
            const mainX = 210;
            const mainW = 365;
            let yPos = 40;
            doc.fillColor('#1A1A2E').fontSize(11).text('PROFIL PROFESSIONNEL', mainX, yPos);
            doc.moveTo(mainX, yPos + 15).lineTo(mainX + mainW, yPos + 15).strokeColor('#4A3DB5').lineWidth(1.5).stroke();
            yPos += 25;
            doc.fillColor('#444').fontSize(9).text(enhanced.summary || data.summary || '', mainX, yPos, { width: mainW, lineGap: 3 });
            yPos += 60;
            doc.fillColor('#1A1A2E').fontSize(11).text('EXPÉRIENCES', mainX, yPos);
            doc.moveTo(mainX, yPos + 15).lineTo(mainX + mainW, yPos + 15).strokeColor('#4A3DB5').lineWidth(1.5).stroke();
            yPos += 25;
            const experiences = enhanced.experience || data.experience || [];
            experiences.forEach((exp) => {
                if (yPos > 750) {
                    doc.addPage();
                    yPos = 40;
                }
                doc.fillColor('#1A1A2E').fontSize(10).text(exp.title || exp.poste || '', mainX, yPos, { width: mainW - 80 });
                doc.fillColor('#4A3DB5').fontSize(9).text(exp.period || exp.periode || '', mainX + mainW - 75, yPos, { width: 75, align: 'right' });
                doc.fillColor('#666').fontSize(9).text(exp.company || exp.entreprise || '', mainX, yPos + 13);
                yPos += 26;
                doc.fillColor('#444').fontSize(8.5).text(exp.description || '', mainX, yPos, { width: mainW, lineGap: 2 });
                yPos += 35;
                if (exp.achievements?.length > 0) {
                    exp.achievements.forEach((ach) => {
                        doc.fillColor('#0F6E56').fontSize(8).text(`- ${ach}`, mainX + 5, yPos, { width: mainW - 5 });
                        yPos += 13;
                    });
                }
                yPos += 10;
            });
            yPos += 5;
            doc.fillColor('#1A1A2E').fontSize(11).text('FORMATION', mainX, yPos);
            doc.moveTo(mainX, yPos + 15).lineTo(mainX + mainW, yPos + 15).strokeColor('#4A3DB5').lineWidth(1.5).stroke();
            yPos += 25;
            const education = enhanced.education || data.education || [];
            education.forEach((edu) => {
                if (yPos > 780) {
                    doc.addPage();
                    yPos = 40;
                }
                doc.fillColor('#1A1A2E').fontSize(10).text(edu.degree || edu.diplome || '', mainX, yPos, { width: mainW - 60 });
                doc.fillColor('#4A3DB5').fontSize(9).text(edu.year || edu.annee || '', mainX + mainW - 55, yPos, { width: 55, align: 'right' });
                doc.fillColor('#666').fontSize(9).text(edu.school || edu.ecole || '', mainX, yPos + 13);
                yPos += 30;
            });
            doc.end();
            stream.on('finish', () => resolve(filepath));
            stream.on('error', reject);
        });
    }
};
exports.CvService = CvService;
exports.CvService = CvService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CvService);
//# sourceMappingURL=cv.service.js.map