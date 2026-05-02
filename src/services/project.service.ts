import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';

// Create
export const createProject = async (data: Prisma.ProjectUncheckedCreateInput, taskIds?: string[]) => {
    return await prisma.project.create({
        data: {
            ...data,
            ...(taskIds && taskIds.length > 0 && {
                tasks: {
                    connect: taskIds.map(taskId => ({ id: taskId }))
                }
            })
        }
    });
};

// Get all projects by user
export const getAllProjectsByUser = async (userId: string) => {
    return await prisma.project.findMany({ where: { userId } });
};

// Get project by id
export const getProjectById = async (id: string, userId: string) => {
    return await prisma.project.findUnique({
        where: { id, userId },
        include: { tasks: true }
    });
};

// Update
export const updateProject = async (id: string, userId: string, data: Prisma.ProjectUncheckedUpdateInput) => {
    return await prisma.project.update({
        where: { id, userId },
        data
    });
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