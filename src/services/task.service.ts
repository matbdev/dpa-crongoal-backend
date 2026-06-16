import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createTask = async (data: Prisma.TaskUncheckedCreateInput, routineId?: string) => {
    if (routineId) {
        // Check for duplicates in the same routine
        const existingRoutineTask = await prisma.routineTask.findFirst({
            where: {
                routineId,
                task: {
                    title: data.title
                }
            }
        });
        
        if (existingRoutineTask) {
            const { AppError } = await import('../utils/AppError');
            throw new AppError('Já existe uma tarefa com esse título na rotina.', 409);
        }
    }

    return await prisma.task.create({ 
        data: {
            ...data,
            ...(routineId ? {
                routineTasks: {
                    create: {
                        routineId
                    }
                }
            } : {})
        } 
    });
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
        select: { 
            generatedPoints: true, 
            userId: true, 
            projectId: true,
            routineTasks: {
                select: {
                    routineId: true
                }
            }
        }
    });

    if (!task) {
        throw new Error('Tarefa não encontrada');
    }

    return await prisma.$transaction(async (tx) => {
        const register = await tx.dailyRegister.create({ data });
        let awardedPoints = 0;

        if (data.isDone) {
            // Check if it belongs to a project or routine
            const isProjectTask = !!task.projectId;
            const isRoutineTask = task.routineTasks && task.routineTasks.length > 0;
            const isUnique = !isProjectTask && !isRoutineTask;

            // Mark task as completed if it's not a routine task (routines reset, projects don't)
            if (!isRoutineTask) {
                await tx.task.update({
                    where: { id: data.taskId },
                    data: { isCompleted: true, status: 'DONE' }
                });
            }

            if (isUnique) {
                // Unique tasks give points immediately
                awardedPoints += task.generatedPoints;
                await tx.user.update({
                    where: { id: task.userId },
                    data: { pointsBalance: { increment: task.generatedPoints } }
                });
            }

            if (isProjectTask) {
                const project = await tx.project.findUnique({
                    where: { id: task.projectId! }
                });

                if (project) {
                    const isOverdue = new Date(project.limitDate) < new Date();
                    const currentTaskPoints = isOverdue ? Math.floor(task.generatedPoints / 2) : task.generatedPoints;
                    awardedPoints += currentTaskPoints;

                    await tx.user.update({
                        where: { id: task.userId },
                        data: { pointsBalance: { increment: currentTaskPoints } }
                    });
                }

                const incompleteTasks = await tx.task.count({
                    where: {
                        projectId: task.projectId,
                        isCompleted: false,
                        id: { not: data.taskId } // exclude current task
                    }
                });

                if (incompleteTasks === 0) {
                    // Project is completed!
                    await tx.project.update({
                        where: { id: task.projectId! },
                        data: { isCompleted: true }
                    });
                }
            }

            if (isRoutineTask) {
                // Routine Logic: Check if all tasks in the routine are completed in the current period
                for (const rt of task.routineTasks) {
                    const routine = await tx.routine.findUnique({
                        where: { id: rt.routineId },
                        include: { routineTasks: { include: { task: true } } }
                    });

                    if (routine) {
                        const now = new Date();
                        let periodStart = new Date(now);
                        
                        switch (routine.period) {
                            case 'DAILY':
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                            case 'WEEKLY':
                                const day = periodStart.getDay();
                                const diff = periodStart.getDate() - day + (day === 0 ? -6 : 1); // Monday
                                periodStart.setDate(diff);
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                            case 'MONTHLY':
                                periodStart.setDate(1);
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                            case 'QUARTERLY':
                                const quarterMonth = Math.floor(periodStart.getMonth() / 3) * 3;
                                periodStart.setMonth(quarterMonth, 1);
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                            case 'SEMIANNUAL':
                                const halfMonth = Math.floor(periodStart.getMonth() / 6) * 6;
                                periodStart.setMonth(halfMonth, 1);
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                            case 'ANNUAL':
                                periodStart.setMonth(0, 1);
                                periodStart.setHours(0, 0, 0, 0);
                                break;
                        }

                        // Check if all tasks in routine have a register since periodStart
                        const routineTasksIds = routine.routineTasks.map(rt => rt.taskId);
                        
                        const completedRegisters = await tx.dailyRegister.groupBy({
                            by: ['taskId'],
                            where: {
                                taskId: { in: routineTasksIds },
                                isDone: true,
                                registerDate: { gte: periodStart }
                            }
                        });

                        // Make sure the current task is considered completed even if register isn't fully committed yet
                        const completedTaskIds = new Set(completedRegisters.map(cr => cr.taskId));
                        completedTaskIds.add(data.taskId);

                        if (completedTaskIds.size === routineTasksIds.length) {
                            // All tasks done! Award points
                            const totalPoints = routine.routineTasks.reduce((sum, rt) => sum + rt.task.generatedPoints, 0);
                            awardedPoints += totalPoints;
                            await tx.user.update({
                                where: { id: task.userId },
                                data: { pointsBalance: { increment: totalPoints } }
                            });
                        }
                    }
                }
            }
        }

        return { register, awardedPoints };
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