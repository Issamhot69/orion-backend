import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async onModuleInit() {
    try { await this.createTables(); console.log('Base de données ORION initialisée'); }
    catch (e) { console.log('DB déjà initialisée — OK'); }
  }

  async createTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        company TEXT,
        company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        filename TEXT, summary TEXT, text TEXT,
        invoice_data JSONB, company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        client_name TEXT, amount FLOAT, currency TEXT DEFAULT 'MAD',
        date TEXT, description TEXT, status TEXT DEFAULT 'draft',
        pdf_path TEXT, company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS memory (
        id SERIAL PRIMARY KEY,
        company_id TEXT, content TEXT, type TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        command TEXT, response TEXT, lang TEXT, intent TEXT,
        company_id TEXT DEFAULT 'company-1',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  async createUser(data: any) {
    const result = await this.pool.query(
      `INSERT INTO users (name, email, password, company) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.email, data.password, data.company]
    );
    return result.rows[0];
  }

  async findUserByEmail(email: string) {
    try {
      const result = await this.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0] || null;
    } catch { return null; }
  }

  async saveDocument(data: any) {
    const result = await this.pool.query(
      `INSERT INTO documents (filename, summary, text, invoice_data, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.filename, data.summary, data.text, JSON.stringify(data.invoiceData), data.companyId]
    );
    return result.rows[0];
  }

  async saveInvoice(data: any) {
    const result = await this.pool.query(
      `INSERT INTO invoices (client_name, amount, currency, date, description, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.clientName, data.amount, data.currency, data.date, data.description, data.companyId]
    );
    return result.rows[0];
  }

  async saveCommand(data: any) {
    try {
      await this.pool.query(
        `INSERT INTO commands (command, response, lang, intent, company_id) VALUES ($1, $2, $3, $4, $5)`,
        [data.command, data.response, data.lang, data.intent, data.companyId]
      );
    } catch (e) {}
  }

  async getDocuments(companyId: string) {
    const result = await this.pool.query(
      `SELECT * FROM documents WHERE company_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [companyId]
    );
    return result.rows;
  }

  async getInvoices(companyId: string) {
    const result = await this.pool.query(
      `SELECT * FROM invoices WHERE company_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [companyId]
    );
    return result.rows;
  }

  async getCommands(companyId: string) {
    const result = await this.pool.query(
      `SELECT * FROM commands WHERE company_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [companyId]
    );
    return result.rows;
  }
}
