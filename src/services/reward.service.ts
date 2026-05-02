import { prisma } from '../config/prisma';
import { Prisma } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';
import * as UploadService from './file.service';

const bucketName = 'crongoal-bucket';

// Create
export const createReward = async (data: Prisma.RewardUncheckedCreateInput) => {
    const reward = await prisma.reward.create({ data });
    return reward;
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
    const reward = await getRewardById(id, userId);

    if (!reward) {
        throw new AppError('Recompensa não encontrada', 404);
    }

    const oldIcon = reward.icon;
    const newIcon = data.icon as string | undefined;

    if (newIcon && newIcon !== oldIcon) {
        if (oldIcon) {
            const oldFilePath = oldIcon.split('/').pop();
            if (oldFilePath) {
                await UploadService.deleteFile(bucketName, oldFilePath).catch(console.error);
            }
        }
    }

    return await prisma.reward.update({
        where: { id, userId },
        data
    });
};

// Delete
export const deleteReward = async (id: string, userId: string) => {
    const reward = await getRewardById(id, userId);

    if (!reward) {
        throw new AppError('Recompensa não encontrada', 404);
    }

    if (reward.icon) {
        const filePath = reward.icon.split('/').pop();
        if (filePath) {
            await UploadService.deleteFile(bucketName, filePath).catch(console.error);
        }
    }

    return await prisma.reward.delete({
        where: { id, userId }
    });
};

// Redeem
export const redeemReward = async (data: Prisma.RedeemHistoryUncheckedCreateInput) => {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    const reward = await prisma.reward.findUnique({ where: { id: data.rewardId } });

    if (!user || !reward) {
        throw new AppError('Usuário ou recompensa não encontrada', 404);
    }

    if (user.pointsBalance < reward.pointsToGet) {
        throw new AppError('Usuário não tem pontos suficientes', 400);
    }

    await prisma.user.update({
        where: { id: data.userId },
        data: { pointsBalance: user.pointsBalance - reward.pointsToGet }
    });

    return await prisma.redeemHistory.create({ data });
}

// Get all redeems by user
export const getAllRedeemsByUser = async (userId: string) => {
    return await prisma.redeemHistory.findMany({
        where: { userId },
        include: { reward: true }
    })
}

// Get all redeems by reward
export const getAllRedeemsByReward = async (rewardId: string, userId: string) => {
    return await prisma.redeemHistory.findMany({
        where: { rewardId, userId },
        include: { reward: true }
    })
}
