import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ExcelService {

  async generateInvoiceExcel(data: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Facture');

    const outputDir = path.join(process.env.HOME || '/tmp', 'Documents', 'ORION', 'factures');
    fs.mkdirSync(outputDir, { recursive: true });
    const filename = `facture_${Date.now()}.xlsx`;
    const filepath = path.join(outputDir, filename);

    // Style header
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'ORION AI OS — FACTURE';
    titleCell.font = { bold: true, size: 18, color: { argb: 'FF4A3DB5' } };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEDFE' } };

    // Info facture
    sheet.mergeCells('A2:C2');
    sheet.getCell('A2').value = `Facture N°: ORION-${Date.now()}`;
    sheet.getCell('A2').font = { bold: true };

    sheet.mergeCells('D2:F2');
    sheet.getCell('D2').value = `Date: ${data.date || new Date().toLocaleDateString('fr-FR')}`;
    sheet.getCell('D2').alignment = { horizontal: 'right' };

    // Client
    sheet.mergeCells('A3:F3');
    sheet.getCell('A3').value = `Client: ${data.clientName || ''}`;
    sheet.getCell('A3').font = { bold: true, size: 12 };
    sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5FF' } };

    // Ligne vide
    sheet.addRow([]);

    // En-têtes tableau
    const headerRow = sheet.addRow(['Description', 'Quantité', 'Prix unitaire', 'TVA %', 'Montant HT', 'Montant TTC']);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4A3DB5' } };
      cell.alignment = { horizontal: 'center' };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FF4A3DB5' } } };
    });

    // Items
    const items = data.items || [{ description: data.description || 'Prestation', qty: 1, price: data.amount || 0, tva: 20 }];
    let totalHT = 0;
    let totalTTC = 0;

    items.forEach((item: any, i: number) => {
      const qty = item.qty || 1;
      const price = item.price || data.amount || 0;
      const tva = item.tva || 20;
      const ht = qty * price;
      const ttc = ht * (1 + tva / 100);
      totalHT += ht;
      totalTTC += ttc;

      const row = sheet.addRow([
        item.description || data.description || 'Prestation',
        qty,
        price,
        `${tva}%`,
        ht,
        ttc
      ]);

      row.getCell(1).alignment = { horizontal: 'left' };
      [2,3,4,5,6].forEach(col => {
        row.getCell(col).alignment = { horizontal: 'center' };
        row.getCell(col).numFmt = col >= 5 ? '#,##0.00' : 'General';
      });

      if (i % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8FF' } };
        });
      }
    });

    // Ligne vide
    sheet.addRow([]);

    // Totaux
    const totalHTRow = sheet.addRow(['', '', '', '', 'Total HT:', totalHT]);
    totalHTRow.getCell(5).font = { bold: true };
    totalHTRow.getCell(6).numFmt = '#,##0.00';

    const totalTVARow = sheet.addRow(['', '', '', '', 'TVA:', totalTTC - totalHT]);
    totalTVARow.getCell(5).font = { bold: true };
    totalTVARow.getCell(6).numFmt = '#,##0.00';

    const totalTTCRow = sheet.addRow(['', '', '', '', 'TOTAL TTC:', totalTTC]);
    totalTTCRow.eachCell(cell => {
      cell.font = { bold: true, size: 14, color: { argb: 'FF4A3DB5' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEDFE' } };
    });
    totalTTCRow.getCell(6).numFmt = '#,##0.00 "' + (data.currency || 'MAD') + '"';

    // Devise info
    sheet.addRow([]);
    const deviseRow = sheet.addRow([`Devise: ${data.currency || 'MAD'} — Généré par ORION AI OS`]);
    deviseRow.getCell(1).font = { color: { argb: 'FF999999' }, italic: true, size: 9 };

    // Largeur colonnes
    sheet.columns = [
      { width: 35 }, { width: 12 }, { width: 15 },
      { width: 10 }, { width: 15 }, { width: 18 }
    ];

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  async generateBudgetExcel(data: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Budget');

    const outputDir = path.join(process.env.HOME || '/tmp', 'Documents', 'ORION', 'budgets');
    fs.mkdirSync(outputDir, { recursive: true });
    const filename = `budget_${Date.now()}.xlsx`;
    const filepath = path.join(outputDir, filename);

    // Titre
    sheet.mergeCells('A1:D1');
    const title = sheet.getCell('A1');
    title.value = `Budget — ${data.name || 'Mon Budget'}`;
    title.font = { bold: true, size: 16, color: { argb: 'FF4A3DB5' } };
    title.alignment = { horizontal: 'center' };
    title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEDFE' } };

    sheet.addRow([]);

    // Headers
    const headers = sheet.addRow(['Catégorie', 'Description', 'Montant Prévu', 'Montant Réel']);
    headers.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4A3DB5' } };
      cell.alignment = { horizontal: 'center' };
    });

    // Données
    const categories = data.categories || [
      { categorie: 'Revenus', description: 'Ventes', prevu: 0, reel: 0 },
      { categorie: 'Dépenses', description: 'Loyer', prevu: 0, reel: 0 },
    ];

    let totalPrevu = 0;
    let totalReel = 0;

    categories.forEach((cat: any, i: number) => {
      const row = sheet.addRow([cat.categorie, cat.description, cat.prevu || 0, cat.reel || 0]);
      totalPrevu += cat.prevu || 0;
      totalReel += cat.reel || 0;
      if (i % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5FF' } };
        });
      }
      [3,4].forEach(col => row.getCell(col).numFmt = '#,##0.00');
    });

    sheet.addRow([]);
    const totalRow = sheet.addRow(['TOTAL', '', totalPrevu, totalReel]);
    totalRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FF4A3DB5' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEDFE' } };
    });
    [3,4].forEach(col => totalRow.getCell(col).numFmt = '#,##0.00');

    sheet.columns = [{ width: 20 }, { width: 30 }, { width: 18 }, { width: 18 }];

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }
}
