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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DatabaseService = class DatabaseService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    async onModuleInit() {
        try {
            await this.createTables();
            console.log('Base de données ORION initialisée');
        }
        catch (e) {
            console.log('DB déjà initialisée — OK');
        }
    }
    async createTables() {
        await this.pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        filename TEXT,
        summary TEXT,
        text TEXT,
        invoice_data JSONB,
        company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        client_name TEXT,
        amount FLOAT,
        currency TEXT DEFAULT 'MAD',
        date TEXT,
        description TEXT,
        status TEXT DEFAULT 'draft',
        pdf_path TEXT,
        company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS memory (
        id SERIAL PRIMARY KEY,
        company_id TEXT,
        content TEXT,
        type TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        command TEXT,
        response TEXT,
        lang TEXT,
        intent TEXT,
        company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    }
    async saveDocument(data) {
        const result = await this.pool.query(`INSERT INTO documents (filename, summary, text, invoice_data, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.filename, data.summary, data.text, JSON.stringify(data.invoiceData), data.companyId]);
        return result.rows[0];
    }
    async saveInvoice(data) {
        const result = await this.pool.query(`INSERT INTO invoices (client_name, amount, currency, date, description, company_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [data.clientName, data.amount, data.currency, data.date, data.description, data.companyId]);
        return result.rows[0];
    }
    async saveCommand(data) {
        try {
            await this.pool.query(`INSERT INTO commands (command, response, lang, intent, company_id)
         VALUES ($1, $2, $3, $4, $5)`, [data.command, data.response, data.lang, data.intent, data.companyId]);
        }
        catch (e) { }
    }
    async getDocuments(companyId) {
        const result = await this.pool.query(`SELECT * FROM documents WHERE company_id = $1 ORDER BY created_at DESC LIMIT 20`, [companyId]);
        return result.rows;
    }
    async getInvoices(companyId) {
        const result = await this.pool.query(`SELECT * FROM invoices WHERE company_id = $1 ORDER BY created_at DESC LIMIT 20`, [companyId]);
        return result.rows;
    }
    async getCommands(companyId) {
        const result = await this.pool.query(`SELECT * FROM commands WHERE company_id = $1 ORDER BY created_at DESC LIMIT 50`, [companyId]);
        return result.rows;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=database.service.js.map