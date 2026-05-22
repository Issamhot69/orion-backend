export declare class AudioService {
    private groq;
    constructor();
    transcribe(buffer: Buffer, mimetype: string, lang?: string): Promise<string>;
}
