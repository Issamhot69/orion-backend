import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { OcrService } from './ocr.service';
import { DocumentAgent } from '../agents/document.agent';
import { DocumentGeneratorService } from './document-generator.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, OcrService, DocumentAgent, DocumentGeneratorService],
  exports: [DocumentsService, DocumentGeneratorService],
})
export class DocumentsModule {}
