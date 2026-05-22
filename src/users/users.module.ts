import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { OrchestratorService } from '../ai/orchestrator.service';
import { DocumentAgent } from '../agents/document.agent';

@Module({
  controllers: [AudioController],
  providers: [AudioService, OrchestratorService, DocumentAgent],
  exports: [AudioService],
})
export class UsersModule {}
