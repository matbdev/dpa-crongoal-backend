import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createRoutine = async (data: Prisma.RoutineUncheckedCreateInput, taskIds?: string[]) => {
    return await prisma.routine.create({
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
        }
    });
};

// Get all routines by user
export const getAllRoutinesByUser = async (userId: string) => {
    return await prisma.routine.findMany({
        where: { userId }
    });
};

// Get routine by id
export const getRoutineById = async (id: string, userId: string) => {
    return await prisma.routine.findUnique({
        where: { id, userId },
        include: {
            routineTasks: {
                include: { task: true }
            }
        }
    });
};

// Update
export const updateRoutine = async (id: string, userId: string, data: Prisma.RoutineUncheckedUpdateInput) => {
    return await prisma.routine.update({
        where: { id, userId },
        data
    });
};

// Add a specific task to a routine
export const addTaskToRoutine = async (routineId: string, taskId: string) => {
    return await prisma.routineTask.create({
        data: { routineId, taskId }
    });
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
