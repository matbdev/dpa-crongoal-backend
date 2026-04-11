import { prisma } from '../config/prisma';
import { Prisma } from '../generated/prisma/client';

// Create
export const createReward = async (data: Prisma.RewardUncheckedCreateInput) => {
    return await prisma.reward.create({
        data: {
            ...data,
            redeems: {
                create: {
                    userId: data.userId,
                    spentPoints: data.pointsToGet
                }
            }
        }
    });
};

// Get all rewards by user
export const getAllRewardsByUser = async (userId: string) => {
    return await prisma.reward.findMany({ where: { userId } });
};

// Get reward by id
export const getRewardById = async (id: string, userId: string) => {
    return await prisma.reward.findUnique({
        where: { id, userId },
        include: { redeems: true }
    });
};

// Update
export const updateReward = async (id: string, userId: string, data: Prisma.RewardUncheckedUpdateInput) => {
    return await prisma.reward.update({
        where: { id, userId },
        data
    });
};

// Delete
export const deleteReward = async (id: string, userId: string) => {
    return await prisma.reward.delete({
        where: { id, userId }
    });
};

// Get all redeems by user
export const getAllRedeemsByUser = async (userId: string) => {
    return await prisma.redeemHistory.findMany({
        where: { userId },
        include: { reward: true }
    })
}
