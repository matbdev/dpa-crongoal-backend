import { prisma } from "../config/prisma";
import { Prisma } from '../generated/prisma/client';

// Create
export const createUser = async (data: Prisma.UserCreateInput) => {
    return await prisma.user.create({ data });
};

// Get all users
export const getAllUsers = async () => {
    return await prisma.user.findMany();
};

// Get user by id
export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            tasks: true,
            routines: true,
            projects: true,
            rewards: true,
            redeems: true
        }
    });
};

// Update
export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    return await prisma.user.update({
        where: { id },
        data
    });
};

// Delete
export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id }
    });
};
