import { Controller, Post, Body, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Post('invoice')
  async invoice(@Body() body: any, @Res() res: Response) {
    const filepath = await this.excelService.generateInvoiceExcel(body);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="facture_orion.xlsx"');
    fs.createReadStream(filepath).pipe(res);
  }

  @Post('budget')
  async budget(@Body() body: any, @Res() res: Response) {
    const filepath = await this.excelService.generateBudgetExcel(body);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="budget_orion.xlsx"');
    fs.createReadStream(filepath).pipe(res);
  }
}
