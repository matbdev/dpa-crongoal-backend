import { Request, Response, NextFunction } from 'express';
import * as RewardService from '../services/reward.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// Create
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const rewardData = { ...req.body, userId: user.id };
        const reward = await RewardService.createReward(rewardData);

        return res.status(201).json(reward);
    } catch (error) {
        next(error);
    };
};

// Get all rewards by user
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const rewards = await RewardService.getAllRewardsByUser(user.id);

        return res.status(200).json(rewards);
    } catch (error) {
        next(error);
    };
};

// Get reward by id
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const reward = await RewardService.getRewardById(req.params.id as string, user.id);

        if (!reward) {
            throw new AppError('Recompensa não encontrada', 404);
        }

        return res.status(200).json(reward);
    } catch (error) {
        next(error);
    };
};

// Update
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const reward = await RewardService.updateReward(req.params.id as string, user.id, req.body);

        return res.status(200).json(reward);
    } catch (error) {
        next(error);
    };
};

// Delete
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const reward = await RewardService.deleteReward(req.params.id as string, user.id);

        return res.status(200).json(reward);
    } catch (error) {
        next(error);
    };
};

// Redeem
export const redeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const redeemData = { ...req.body, userId: user.id, rewardId: req.params.id };
        const redeem = await RewardService.redeemReward(redeemData);

        return res.status(200).json(redeem);
    } catch (error) {
        next(error);
    };
};

// Get all redeems by user
export const getAllRedeems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const redeems = await RewardService.getAllRedeemsByUser(user.id);

        return res.status(200).json(redeems);
    } catch (error) {
        next(error);
    };
};

// Get all redeems by reward
export const getAllRedeemsByReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const redeems = await RewardService.getAllRedeemsByReward(req.params.id as string, user.id);

        return res.status(200).json(redeems);
    } catch (error) {
        next(error);
    };
};
