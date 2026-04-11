import { Request, Response, NextFunction } from 'express';
import { User } from '../../generated/prisma/client';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Runs after requireJwt
    const user = req.user as User;

    // Check if the user is admin
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Forbidden: Acesso negado. Essa rota exige privilégios de Administrador.'
        });
    }

    next();
};
