import { InvoiceService } from './invoice.service';
import { Response } from 'express';
export declare class InvoicesController {
    private invoiceService;
    constructor(invoiceService: InvoiceService);
    generate(body: any, res: Response): Promise<void>;
}
