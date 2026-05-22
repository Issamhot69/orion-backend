import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioService } from './audio.service';
import { OrchestratorService } from '../ai/orchestrator.service';

@Controller('audio')
export class AudioController {
  constructor(
    private audioService: AudioService,
    private orchestrator: OrchestratorService,
  ) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(@UploadedFile() file: any, @Body() body: { lang: string; companyId: string }) {
    const lang = body.lang || 'fr-FR';
    const text = await this.audioService.transcribe(file.buffer, file.mimetype, lang);
    const response = await this.orchestrator.processCommand(text, body.companyId || 'company-1', lang);
    return { transcription: text, ...response };
  }
}
