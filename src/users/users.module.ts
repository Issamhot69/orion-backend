import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { OrchestratorService } from '../ai/orchestrator.service';
import { DocumentAgent } from '../agents/document.agent';

@Module({
  controllers: [AudioController, EmailController],
  providers: [AudioService, EmailService, OrchestratorService, DocumentAgent],
  exports: [AudioService, EmailService],
})
export class UsersModule {}
