import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/document.service';
import { CreateDocumentDTO } from '../dto/document.dto';

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // O TS não reclama de req.user graças ao express.d.ts e o ! confia que o authMiddleware foi executado
      const userId = req.user!.id; 
      const data: CreateDocumentDTO = req.body;
      
      const result = await this.documentService.createDocument(userId, data);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.documentService.getUserDocuments(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const documentId = req.params.id;
      
      const result = await this.documentService.getDocumentById(userId, documentId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const documentId = req.params.id;
      const data = req.body;
      
      const result = await this.documentService.updateDocument(userId, documentId, data);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
