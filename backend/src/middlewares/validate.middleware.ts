import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Falha na validação',
          errors: error.errors,
        });
      }
      return next(error);
    }
  };
