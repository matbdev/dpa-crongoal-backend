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
            error: 'Registro não encontrado'
        });
    }

    // Prisma: Unique constraint violation
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const target = (err.meta?.target as string[])?.join(', ') || '';
        
        let errorMessage = `Já existe um registro com esse valor.`;
        
        if (target.includes('projectId') && target.includes('title')) {
            errorMessage = 'Já existe uma tarefa com esse nome dentro desse projeto';
        } else if (target.includes('userId') && target.includes('name')) {
            errorMessage = 'Já existe uma rotina com esse nome';
        } else if (target.includes('userId') && target.includes('title')) {
            errorMessage = 'Já existe um projeto com esse nome';
        } else if (target.includes('email')) {
            errorMessage = 'Este email já está em uso';
        }

        return res.status(409).json({
            error: errorMessage
        });
    }

    // Prisma: Foreign key constraint
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        return res.status(400).json({
            error: 'Referência inválida: o registro relacionado não existe'
        });
    }

    // Prisma: Validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            error: 'Dados inválidos'
        });
    }

    // Fallback: Unknown/unexpected error
    return res.status(500).json({
        error: 'Erro interno'
    });
};
