import { Request, Response, NextFunction } from 'express';
import * as KanbanColumnService from '../services/kanbanColumn.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const columnData = { ...req.body, userId: user.id };
        const column = await KanbanColumnService.createColumn(columnData);

        return res.status(201).json(column);
    } catch (error) {
        next(error);
    }
};

// Get all columns by project
export const getByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const columns = await KanbanColumnService.getColumnsByProject(req.params.projectId as string);

        return res.status(200).json(columns);
    } catch (error) {
        next(error);
    }
};

// Get column by id
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const column = await KanbanColumnService.getColumnById(req.params.id as string);

        if (!column) {
            throw new AppError('Coluna não encontrada', 404);
        }

        return res.status(200).json(column);
    } catch (error) {
        next(error);
    }
};

// Update
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const column = await KanbanColumnService.updateColumn(req.params.id as string, req.body);

        return res.status(200).json(column);
    } catch (error) {
        next(error);
    }
};

// Delete
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const column = await KanbanColumnService.deleteColumn(req.params.id as string);

        return res.status(200).json(column);
    } catch (error) {
        next(error);
    }
};
