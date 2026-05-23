import { Controller, Post, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentGeneratorService } from './document-generator.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('documents')
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private documentGenerator: DocumentGeneratorService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any, @Body() body: { companyId: string }) {
    return this.documentsService.processUpload(file, body.companyId || 'company-1');
  }

  @Post('generate-doc')
  async generateDoc(@Body() body: { type: string; data: any; lang: string }, @Res() res: Response) {
    const filepath = await this.documentGenerator.generateDocument(body.type, body.data, body.lang);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${body.type}_orion.pdf"`);
    fs.createReadStream(filepath).pipe(res);
  }
}
