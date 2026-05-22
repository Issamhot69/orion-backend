export declare class WhatsappService {
    private client;
    constructor();
    sendMessage(to: string, message: string): Promise<any>;
    sendInvoice(to: string, invoiceData: any): Promise<any>;
}
