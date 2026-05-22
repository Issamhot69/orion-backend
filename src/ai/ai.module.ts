import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { DocumentAgent } from '../agents/document.agent';

@Module({
  providers: [OrchestratorService, DocumentAgent],
  exports: [OrchestratorService],
})
export class AiModule {}
