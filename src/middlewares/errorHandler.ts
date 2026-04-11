import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[ERROR]:', err.message);

    // Custom AppError
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    // Prisma: Record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return res.status(404).json({
            error: 'Resource not found'
        });
    }

    // Prisma: Unique constraint violation
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        return res.status(409).json({
            error: `A record with this ${target} already exists`
        });
    }

    // Prisma: Foreign key constraint
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        return res.status(400).json({
            error: 'Invalid reference: the related record does not exist'
        });
    }

    // Prisma: Validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            error: 'Invalid data format'
        });
    }

    // Fallback: Unknown/unexpected error
    return res.status(500).json({
        error: 'Internal server error'
    });
};
