import { prisma } from '../config/prisma';
import { Prisma } from '../generated/prisma/client';

// Create
export const createColumn = async (data: Prisma.KanbanColumnUncheckedCreateInput) => {
    return await prisma.kanbanColumn.create({ data });
};

// Get all columns by project
export const getColumnsByProject = async (projectId: string) => {
    return await prisma.kanbanColumn.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
        include: { tasks: true }
    });
};

// Get column by id
export const getColumnById = async (id: string) => {
    return await prisma.kanbanColumn.findUnique({
        where: { id },
        include: { tasks: true }
    });
};

// Update
export const updateColumn = async (id: string, data: Prisma.KanbanColumnUncheckedUpdateInput) => {
    return await prisma.kanbanColumn.update({
        where: { id },
        data
    });
};

// Delete
export const deleteColumn = async (id: string) => {
    return await prisma.kanbanColumn.delete({
        where: { id }
    });
};
