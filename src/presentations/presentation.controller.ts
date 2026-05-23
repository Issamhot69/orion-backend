import { Controller, Post, Body, Res } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('presentations')
export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  @Post('generate')
  async generate(@Body() body: any, @Res() res: Response) {
    const filepath = await this.presentationService.generatePresentation(body);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename="presentation_orion.pptx"');
    fs.createReadStream(filepath).pipe(res);
  }
}
