export declare class DocumentAgent {
    private client;
    constructor();
    process(command: string, companyId: string): Promise<{
        agent: string;
        status: string;
        companyId: string;
    }>;
    summarize(text: string): Promise<string>;
    extractInvoiceData(text: string): Promise<any>;
}
