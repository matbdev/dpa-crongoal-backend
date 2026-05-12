import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createProject = async (data: Prisma.ProjectUncheckedCreateInput, taskIds?: string[]) => {
    const project = await prisma.project.create({
        data: {
            ...data,
            ...(taskIds && taskIds.length > 0 && {
                tasks: {
                    connect: taskIds.map(taskId => ({ id: taskId }))
                }
            })
        },
        include: { tasks: true }
    });

    // Mark tasks as RECURRENT when added to a project
    if (taskIds && taskIds.length > 0) {
        await prisma.task.updateMany({
            where: { id: { in: taskIds } },
            data: { type: 'RECURRENT' }
        });
    }

    return project;
};

// Get all projects by user
export const getAllProjectsByUser = async (userId: string) => {
    return await prisma.project.findMany({ 
        where: { userId },
        include: { tasks: true }
    });
};

// Get project by id
export const getProjectById = async (id: string, userId: string) => {
    return await prisma.project.findUnique({
        where: { id, userId },
        include: { tasks: true }
    });
};

// Update
export const updateProject = async (id: string, userId: string, data: Prisma.ProjectUncheckedUpdateInput, taskIds?: string[]) => {
    const project = await prisma.project.update({
        where: { id, userId },
        data: {
            ...data,
            ...(taskIds !== undefined && {
                tasks: {
                    set: taskIds.map(taskId => ({ id: taskId }))
                }
            })
        },
        include: { tasks: true }
    });

    // Mark tasks as RECURRENT when added to a project
    if (taskIds && taskIds.length > 0) {
        await prisma.task.updateMany({
            where: { id: { in: taskIds } },
            data: { type: 'RECURRENT' }
        });
    }

    return project;
};

// Delete
export const deleteProject = async (id: string, userId: string) => {
    return await prisma.project.delete({
        where: { id, userId }
    });
};

// Get count
export const countProjects = async (userId: string) => {
    return await prisma.project.count({
        where: { userId }
    });
}