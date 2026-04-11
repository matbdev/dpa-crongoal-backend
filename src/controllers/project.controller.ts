import { Request, Response, NextFunction } from 'express';
import * as ProjectService from '../services/project.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const projectData = { ...req.body, userId: user.id };
        const taskIds = req.body.taskIds;

        const project = await ProjectService.createProject(projectData, taskIds);

        return res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

// Get all projects by user
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const projects = await ProjectService.getAllProjectsByUser(user.id);
        return res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// Get project by id
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const project = await ProjectService.getProjectById(req.params.id as string, user.id);

        if (!project) {
            throw new AppError('Projeto não encontrado', 404);
        }

        return res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// Update
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const project = await ProjectService.updateProject(req.params.id as string, user.id, req.body);
        return res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// Delete
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        await ProjectService.deleteProject(req.params.id as string, user.id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
