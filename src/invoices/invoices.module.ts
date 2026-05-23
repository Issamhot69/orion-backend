import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoicesController } from './invoices.controller';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';

@Module({
  controllers: [InvoicesController, ExcelController],
  providers: [InvoiceService, ExcelService],
  exports: [InvoiceService, ExcelService],
})
export class InvoicesModule {}
