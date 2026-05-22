import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { OcrService } from './ocr.service';
import { DocumentAgent } from '../agents/document.agent';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, OcrService, DocumentAgent],
  exports: [DocumentsService],
})
export class DocumentsModule {}
