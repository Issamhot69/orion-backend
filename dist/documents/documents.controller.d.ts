import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    upload(file: any, body: {
        companyId: string;
    }): Promise<{
        filename: any;
        size: any;
        text: string;
        summary: string;
        invoiceData: any;
        companyId: string;
        processedAt: Date;
    }>;
}
