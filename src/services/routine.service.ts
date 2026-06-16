import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createRoutine = async (data: Prisma.RoutineUncheckedCreateInput, taskIds?: string[]) => {
    if (taskIds && taskIds.length > 0) {
        const tasksToAdd = await prisma.task.findMany({
            where: { id: { in: taskIds } },
            select: { title: true }
        });
        const titles = tasksToAdd.map(t => t.title);
        if (new Set(titles).size !== titles.length) {
            const { AppError } = await import('../utils/AppError');
            throw new AppError('Não é permitido adicionar tarefas com títulos iguais à rotina.', 409);
        }
    }

    const routine = await prisma.routine.create({
        data: {
            ...data,
            // If tasks are already created, connect them to the routine
            ...(taskIds && taskIds.length > 0 && {
                routineTasks: {
                    create: taskIds.map(taskId => ({
                        task: { connect: { id: taskId } }
                    }))
                }
            })
        },
        include: { routineTasks: true }
    });

    // Mark tasks as RECURRENT when added to a routine
    if (taskIds && taskIds.length > 0) {
        await prisma.task.updateMany({
            where: { id: { in: taskIds } },
            data: { type: 'RECURRENT' }
        });
    }

    return routine;
};

// Get all routines by user
export const getAllRoutinesByUser = async (userId: string) => {
    return await prisma.routine.findMany({
        where: { userId },
        include: { 
            routineTasks: {
                include: { 
                    task: {
                        include: { registers: true }
                    }
                }
            } 
        }
    });
};

// Get routine by id
export const getRoutineById = async (id: string, userId: string) => {
    return await prisma.routine.findUnique({
        where: { id, userId },
        include: {
            routineTasks: {
                include: { 
                    task: {
                        include: { registers: true }
                    } 
                }
            }
        }
    });
};

// Update
export const updateRoutine = async (id: string, userId: string, data: Prisma.RoutineUncheckedUpdateInput, taskIds?: string[]) => {
    if (taskIds && taskIds.length > 0) {
        const tasksToAdd = await prisma.task.findMany({
            where: { id: { in: taskIds } },
            select: { title: true }
        });
        const titles = tasksToAdd.map(t => t.title);
        if (new Set(titles).size !== titles.length) {
            const { AppError } = await import('../utils/AppError');
            throw new AppError('Não é permitido adicionar tarefas com títulos iguais à rotina.', 409);
        }
    }

    const routine = await prisma.routine.update({
        where: { id, userId },
        data: {
            ...data,
            ...(taskIds !== undefined && {
                routineTasks: {
                    deleteMany: {},
                    create: taskIds.map(taskId => ({
                        task: { connect: { id: taskId } }
                    }))
                }
            })
        },
        include: { routineTasks: true }
    });

    // Mark tasks as RECURRENT when added to a routine
    if (taskIds && taskIds.length > 0) {
        await prisma.task.updateMany({
            where: { id: { in: taskIds } },
            data: { type: 'RECURRENT' }
        });
    }

    return routine;
};

// Add a specific task to a routine
export const addTaskToRoutine = async (routineId: string, taskId: string) => {
    // 1. Get the task title
    const taskToAdd = await prisma.task.findUnique({
        where: { id: taskId },
        select: { title: true }
    });

    if (!taskToAdd) {
        const { AppError } = await import('../utils/AppError');
        throw new AppError('Tarefa não encontrada.', 404);
    }

    // 2. Check if a task with the same title already exists in the routine
    const existingRoutineTask = await prisma.routineTask.findFirst({
        where: {
            routineId,
            task: {
                title: taskToAdd.title
            }
        }
    });

    if (existingRoutineTask) {
        const { AppError } = await import('../utils/AppError');
        throw new AppError('Já existe uma tarefa com esse título na rotina.', 409);
    }

    const newRoutineTask = await prisma.routineTask.create({
        data: { routineId, taskId }
    });

    // Mark task as RECURRENT
    await prisma.task.update({
        where: { id: taskId },
        data: { type: 'RECURRENT' }
    });

    return newRoutineTask;
};

export const removeTaskFromRoutine = async (routineId: string, taskId: string) => {
    return await prisma.routineTask.delete({
        where: {
            routineId_taskId: { routineId, taskId }
        }
    });
};

// Delete
export const deleteRoutine = async (id: string, userId: string) => {
    return await prisma.routine.delete({
        where: { id, userId }
    });
};

// Count
export const countRoutines = async (userId: string) => {
    return await prisma.routine.count({
        where: { userId }
    });
};
