import { OnModuleInit } from '@nestjs/common';
export declare class DatabaseService implements OnModuleInit {
    private pool;
    constructor();
    onModuleInit(): Promise<void>;
    createTables(): Promise<void>;
    saveDocument(data: any): Promise<any>;
    saveInvoice(data: any): Promise<any>;
    saveCommand(data: any): Promise<void>;
    getDocuments(companyId: string): Promise<any[]>;
    getInvoices(companyId: string): Promise<any[]>;
    getCommands(companyId: string): Promise<any[]>;
}
