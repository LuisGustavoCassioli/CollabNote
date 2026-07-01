import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título do documento é obrigatório').max(100, 'O título deve ter no máximo 100 caracteres'),
  }),
});

export type CreateDocumentDTO = z.infer<typeof createDocumentSchema>['body'];
