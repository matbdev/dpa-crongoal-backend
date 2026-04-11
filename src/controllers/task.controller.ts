import { Request, Response, NextFunction } from 'express';
import * as TaskService from '../services/task.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const taskData = { ...req.body, userId: user.id };
        const task = await TaskService.createTask(taskData);

        return res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// Get all tasks by user
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const tasks = await TaskService.getAllTasksByUser(user.id);

        return res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Get task by id
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const task = await TaskService.getTaskById(req.params.id as string, user.id);

        if (!task) {
            throw new AppError('Tarefa não encontrada', 404);
        }

        return res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Update
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const task = await TaskService.updateTask(req.params.id as string, user.id, req.body);

        return res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Delete
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const task = await TaskService.deleteTask(req.params.id as string, user.id);

        return res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Daily Registers
// Create
export const createDailyRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const registerData = { ...req.body, userId: user.id };
        const register = await TaskService.createDailyRegister(registerData);

        return res.status(201).json(register);
    } catch (error) {
        next(error);
    };
};

// Get all daily tasks
export const getAllDailyTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const tasks = await TaskService.getAllDailyTasks(user.id);

        return res.status(200).json(tasks);
    } catch (error) {
        next(error);
    };
};

// Kanban
// Move task to column
export const moveToColumn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const task = await TaskService.moveTaskToColumn(req.params.id as string, req.body.newColumnId as string);

        return res.status(200).json(task);
    } catch (error) {
        next(error);
    };
};
