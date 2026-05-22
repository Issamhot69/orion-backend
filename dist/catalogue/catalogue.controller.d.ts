import { CatalogueService } from './catalogue.service';
import { Response } from 'express';
export declare class CatalogueController {
    private catalogueService;
    constructor(catalogueService: CatalogueService);
    generate(body: any): Promise<{
        name: any;
        type: any;
        lang: any;
        catalogue: any;
        companyId: any;
        createdAt: Date;
    }>;
    generatePDF(body: any, res: Response): Promise<void>;
}
