import { DocumentRepository } from '../repositories/document.repository';
import { CreateDocumentDTO } from '../dto/document.dto';
import { AppError } from '../errors/app-error';

export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async createDocument(userId: string, data: CreateDocumentDTO) {
    const document = await this.documentRepository.create({
      title: data.title,
      ownerId: userId,
      content: '', // O documento nasce com o corpo vazio
    });

    return document;
  }

  async getUserDocuments(userId: string) {
    return this.documentRepository.findAllByUserId(userId);
  }

  async getDocumentById(userId: string, documentId: string) {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new AppError('Documento não encontrado', 404);
    }

    // Regra de segurança: Checar se o usuário atual tem autorização para ler o documento
    const isOwner = document.ownerId === userId;
    const isCollaborator = document.collaborators.some(col => col.userId === userId);

    if (!isOwner && !isCollaborator) {
      throw new AppError('Acesso negado. Você não tem permissão para visualizar este documento.', 403);
    }

    return document;
  }

  async updateDocument(userId: string, documentId: string, data: { title?: string; content?: string }) {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new AppError('Documento não encontrado', 404);
    }

    const isOwner = document.ownerId === userId;
    const isCollaborator = document.collaborators.some(col => col.userId === userId);

    if (!isOwner && !isCollaborator) {
      throw new AppError('Acesso negado. Você não tem permissão para editar este documento.', 403);
    }

    return this.documentRepository.update(documentId, data);
  }
}
