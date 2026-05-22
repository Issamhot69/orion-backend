import { OrchestratorService } from './ai/orchestrator.service';
export declare class AppController {
    private orchestrator;
    constructor(orchestrator: OrchestratorService);
    health(): {
        status: string;
        port: number;
    };
    command(body: {
        command: string;
        companyId: string;
        lang: string;
    }): Promise<{
        agent: string;
        message: string;
        intent: string;
        companyId: string;
        lang: string;
    }>;
}
