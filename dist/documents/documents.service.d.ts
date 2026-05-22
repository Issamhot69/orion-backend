import { OcrService } from './ocr.service';
export declare class DocumentsService {
    private ocrService;
    private ollama;
    constructor(ocrService: OcrService);
    processUpload(file: any, companyId: string): Promise<{
        filename: any;
        size: any;
        text: string;
        summary: string;
        invoiceData: any;
        companyId: string;
        processedAt: Date;
    }>;
    private summarize;
    private extractInvoiceData;
}
