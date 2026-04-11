import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { User } from '../../generated/prisma/client';

// Google auth callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const authToken = AuthService.handleGoogleCallback(user);

        // Redirect to front-end
        const feBase = process.env.FE_BASE_URL || 'http://localhost:5001';
        const redirectUrl = `${feBase}?accessToken=${authToken}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        next(error);
    }
};

// Local login
export const localLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const authToken = await AuthService.loginLocal(email, password);

        return res.status(200).json({ authToken });
    } catch (error) {
        // Security treatment
        if (error instanceof Error && error.message.includes('invalid credentials')) {
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
};

// Local register
export const localRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, fullName } = req.body;
        const authToken = await AuthService.localRegister(email, password, fullName);

        return res.status(201).json({ authToken });
    } catch (error) {
        // If the email already exists, return 400 Bad Request
        if (error instanceof Error && error.message.includes('already exists')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
