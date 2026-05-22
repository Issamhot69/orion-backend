import 'dotenv/config';
export declare class OrchestratorService {
    private groq;
    constructor();
    processCommand(command: string, companyId: string, lang?: string): Promise<{
        agent: string;
        message: string;
        intent: string;
        companyId: string;
        lang: string;
    }>;
    private detectIntent;
}
