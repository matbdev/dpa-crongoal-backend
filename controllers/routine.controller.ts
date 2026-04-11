import { Request, Response, NextFunction } from 'express';
import * as RoutineService from '../services/routine.service';
import { User } from '../generated/prisma/client';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const routineData = { ...req.body, userId: user.id };
        const tasks = req.body.taskIds;

        const routine = await RoutineService.createRoutine(routineData, tasks);

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
            return res.status(404).json({ error: 'Rotina não encontrada' });
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
        const routine = await RoutineService.updateRoutine(req.params.id as string, user.id, req.body);

        return res.status(200).json(routine);
    } catch (error) {
        next(error);
    };
};

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
