export declare class CvService {
    private groq;
    constructor();
    enhanceCV(data: any): Promise<any>;
    generateCVPDF(data: any): Promise<string>;
}
