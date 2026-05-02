import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createTask = async (data: Prisma.TaskUncheckedCreateInput) => {
    return await prisma.task.create({ data });
};

// Get all tasks by user
export const getAllTasksByUser = async (userId: string) => {
    return await prisma.task.findMany({
        where: { userId }
    });
};

// Get task by id
export const getTaskById = async (id: string, userId: string) => {
    return await prisma.task.findUnique({
        where: { id, userId },
        include: {
            registers: true,
            routineTasks: {
                include: { routine: true }
            },
            project: true
        }
    });
};

// Update
export const updateTask = async (id: string, userId: string, data: Prisma.TaskUncheckedUpdateInput) => {
    return await prisma.task.update({
        where: { id, userId },
        data
    });
};

// Delete
export const deleteTask = async (id: string, userId: string) => {
    return await prisma.task.delete({
        where: { id, userId }
    });
};

// Create daily register
export const createDailyRegister = async (data: Prisma.DailyRegisterUncheckedCreateInput) => {
    return await prisma.dailyRegister.create({
        data
    });
};

// Get all daily tasks by user
export const getAllDailyTasks = async (userId: string) => {
    return await prisma.dailyRegister.findMany({
        where: { task: { userId } },
        include: { task: true }
    })
}

// Move task to column
export const moveTaskToColumn = async (taskId: string, newColumnId: string) => {
    return await prisma.task.update({
        where: { id: taskId },
        data: { columnId: newColumnId }
    });
};

// Count
export const countTasks = async (userId: string) => {
    return await prisma.task.count({
        where: { userId }
    });
};