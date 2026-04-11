import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

export const validate = (schema: z.ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate body, query, and params
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;

            // Replace req data with validated/transformed data
            req.body = validatedData.body;
            req.query = validatedData.query;
            req.params = validatedData.params;

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    errors: z.treeifyError(error),
                });
            }
            return next(error);
        }
    };
