import { AudioService } from './audio.service';
import { OrchestratorService } from '../ai/orchestrator.service';
export declare class AudioController {
    private audioService;
    private orchestrator;
    constructor(audioService: AudioService, orchestrator: OrchestratorService);
    transcribe(file: any, body: {
        lang: string;
        companyId: string;
    }): Promise<{
        agent: string;
        message: string;
        intent: string;
        companyId: string;
        lang: string;
        transcription: string;
    }>;
}
