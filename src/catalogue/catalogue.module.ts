import { Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { DatabaseService } from '../memory/database.service';

@Module({
  controllers: [CatalogueController],
  providers: [CatalogueService, DatabaseService],
  exports: [CatalogueService],
})
export class CatalogueModule {}
