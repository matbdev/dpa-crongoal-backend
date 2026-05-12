import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createTask = async (data: Prisma.TaskUncheckedCreateInput) => {
    return await prisma.task.create({ data });
};

// Get all tasks by user
export const getAllTasksByUser = async (userId: string) => {
    return await prisma.task.findMany({
        where: { userId },
        include: {
            routineTasks: {
                include: { routine: true }
            },
            project: true
        }
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

// Create daily register, award points, mark task completed, auto-complete project
export const createDailyRegister = async (data: Prisma.DailyRegisterUncheckedCreateInput) => {
    const task = await prisma.task.findUnique({
        where: { id: data.taskId },
        select: { generatedPoints: true, userId: true, projectId: true }
    });

    if (!task) {
        throw new Error('Tarefa não encontrada');
    }

    return await prisma.$transaction(async (tx) => {
        const register = await tx.dailyRegister.create({ data });

        if (data.isDone) {
            // Award points to user
            await tx.user.update({
                where: { id: task.userId },
                data: { pointsBalance: { increment: task.generatedPoints } }
            });

            // Mark task as completed
            await tx.task.update({
                where: { id: data.taskId },
                data: { isCompleted: true }
            });

            // Auto-complete project if all its tasks are now completed
            if (task.projectId) {
                const incompleteTasks = await tx.task.count({
                    where: {
                        projectId: task.projectId,
                        isCompleted: false,
                        id: { not: data.taskId } // exclude current task (already marked above)
                    }
                });

                if (incompleteTasks === 0) {
                    await tx.project.update({
                        where: { id: task.projectId },
                        data: { isCompleted: true }
                    });
                }
            }
        }

        return register;
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