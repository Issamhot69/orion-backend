import { Controller, Post, Body, Res } from '@nestjs/common';
import { CvService } from './cv.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('cv')
export class CvController {
  constructor(private cvService: CvService) {}

  @Post('generate')
  async generate(@Body() body: any) {
    return this.cvService.enhanceCV(body);
  }

  @Post('pdf')
  async generatePDF(@Body() body: any, @Res() res: Response) {
    const filepath = await this.cvService.generateCVPDF(body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv_orion.pdf"');
    fs.createReadStream(filepath).pipe(res);
  }
}
