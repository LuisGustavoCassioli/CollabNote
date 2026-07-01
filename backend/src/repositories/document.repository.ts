import { prisma } from '../config/prisma';
import { Prisma, Document } from '@prisma/client';

export class DocumentRepository {
  async create(data: Prisma.DocumentUncheckedCreateInput): Promise<Document> {
    return prisma.document.create({ data });
  }

  async findAllByUserId(userId: string): Promise<Document[]> {
    // Busca os documentos em que o usuário é dono OU é um colaborador registrado
    return prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId: userId } } }
        ]
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findById(id: string): Promise<Document | null> {
    return prisma.document.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        collaborators: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });
  }

  async update(id: string, data: Prisma.DocumentUpdateInput): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data
    });
  }
}
