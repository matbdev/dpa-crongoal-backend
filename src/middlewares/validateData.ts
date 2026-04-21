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
            if (validatedData.body) req.body = validatedData.body;

            if (validatedData.query) {
                Object.defineProperty(req, 'query', {
                    value: validatedData.query,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }

            if (validatedData.params) {
                Object.defineProperty(req, 'params', {
                    value: validatedData.params,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    errors: error.issues.map((err: any) => ({
                        path: err.path,
                        message: err.message
                    })),
                });
            }
            return next(error);
        }
    };
