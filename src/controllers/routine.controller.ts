import { Request, Response, NextFunction } from 'express';
import * as RoutineService from '../services/routine.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const { taskIds, ...restBody } = req.body;

        if (!taskIds || taskIds.length === 0) {
            throw new AppError('Uma rotina deve ter ao menos uma tarefa.', 400);
        }

        const routineData = { ...restBody, userId: user.id };

        const routine = await RoutineService.createRoutine(routineData, taskIds);

        return res.status(201).json(routine);
    } catch (error) {
        next(error);
    };
};

// Get all routines by user
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routines = await RoutineService.getAllRoutinesByUser(user.id);

        return res.status(200).json(routines);
    } catch (error) {
        next(error);
    }
};

// Get routine by id
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routine = await RoutineService.getRoutineById(req.params.id as string, user.id);

        if (!routine) {
            throw new AppError('Rotina não encontrada', 404);
        };

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
};

// Update
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const { taskIds, ...restBody } = req.body;

        if (!taskIds || taskIds.length === 0) {
            throw new AppError('Uma rotina deve ter ao menos uma tarefa.', 400);
        }

        const routine = await RoutineService.updateRoutine(req.params.id as string, user.id, restBody, taskIds);

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
};

// Delete
export const deleteRoutine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routine = await RoutineService.deleteRoutine(req.params.id as string, user.id);

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
}

// Add task to routine
export const addTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routine = await RoutineService.addTaskToRoutine(req.params.id as string, req.body.taskId as string);

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
};

// Remove task from routine
export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routine = await RoutineService.removeTaskFromRoutine(req.params.id as string, req.body.taskId as string);

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
};

// Get Count
export const getCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const count = await RoutineService.countRoutines(user.id);
        return res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}
