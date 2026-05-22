import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrchestratorService } from './ai/orchestrator.service';

@Controller()
export class AppController {
  constructor(private orchestrator: OrchestratorService) {}

  @Get()
  health() {
    return { status: 'ORION AI OS opérationnel', port: 5555 };
  }

  @Post('command')
  async command(@Body() body: { command: string; companyId: string; lang: string }) {
    return this.orchestrator.processCommand(body.command, body.companyId, body.lang || 'fr-FR');
  }
}
