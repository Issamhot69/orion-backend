import { CvService } from './cv.service';
import { Response } from 'express';
export declare class CvController {
    private cvService;
    constructor(cvService: CvService);
    generate(body: any): Promise<any>;
    generatePDF(body: any, res: Response): Promise<void>;
}
