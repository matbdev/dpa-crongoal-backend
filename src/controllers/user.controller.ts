import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';
import { User } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

// ADMIN
// Get all users
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// PROFILE
// Get profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.user as User;

        const userProfile = await UserService.getUserById(loggedUser.id);

        if (!userProfile) {
            throw new AppError('Usuário não encontrado', 404);
        }

        // Removes hashPassword from response
        delete (userProfile as any).hashPassword;

        return res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};

// Update profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.user as User;

        // Prevents ID or password from being accidentally changed by injection
        const { id, hashPassword, email, ...safeDataToUpdate } = req.body;
        const updatedUser = await UserService.updateUser(loggedUser.id, safeDataToUpdate);

        delete (updatedUser as any).hashPassword;
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Delete account
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedUser = req.user as User;
        await UserService.deleteUser(loggedUser.id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
