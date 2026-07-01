import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { DocumentService } from '../services/document.service';
import { DocumentRepository } from '../repositories/document.repository';
import { validateRequest } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createDocumentSchema } from '../dto/document.dto';

const documentRoutes = Router();

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

// TODAS as rotas de documentos são estritamente protegidas 
documentRoutes.use(authMiddleware);

documentRoutes.post('/', validateRequest(createDocumentSchema), documentController.create);
documentRoutes.get('/', documentController.list);
documentRoutes.get('/:id', documentController.getById);
documentRoutes.put('/:id', documentController.update);

export { documentRoutes };
