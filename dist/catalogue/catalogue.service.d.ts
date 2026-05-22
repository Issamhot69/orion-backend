import { DatabaseService } from '../memory/database.service';
export declare class CatalogueService {
    private db;
    private groq;
    constructor(db: DatabaseService);
    formatPrice(price: any): string;
    generateCatalogue(data: any): Promise<{
        name: any;
        type: any;
        lang: any;
        catalogue: any;
        companyId: any;
        createdAt: Date;
    }>;
    generateCataloguePDF(data: any): Promise<string>;
}
