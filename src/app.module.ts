import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocumentsModule } from './documents/documents.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { MemoryModule } from './memory/memory.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { CvModule } from './cv/cv.module';
import { OrchestratorService } from './ai/orchestrator.service';
import { DocumentAgent } from './agents/document.agent';

@Module({
  imports: [DocumentsModule, InvoicesModule, UsersModule, AiModule, MemoryModule, CatalogueModule, CvModule],
  controllers: [AppController],
  providers: [OrchestratorService, DocumentAgent],
})
export class AppModule {}
