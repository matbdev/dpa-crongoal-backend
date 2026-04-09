// authRoute.ts
import { Request, Response, Router } from 'express';
import passport from '../auth/passport';
import * as AuthService from '../services/auth.service'
import { User } from '../generated/prisma/client';

const router = Router();

/*
  This route triggers the Google sign-in/sign-up flow. 
  When the frontend calls it, the user will be redirected to the 
  Google accounts page to log in with their Google account.
*/
router.get(
    '/google',
    passport.authenticate(
        'google', { scope: ['profile', 'email'] }
    )
);

/*
  This route is the callback endpoint for Google OAuth2.0. 
  After the user logs in via Google's authentication flow, they are redirected here.
  Passport.js processes the callback, attaches the user to req.user, and we handle 
  the access token generation and redirect the user to the frontend.
*/
// Google OAuth2.0 callback route
router.get(
    '/google/callback',
    passport.authenticate(
        'google',
        { session: false }
    ),
    (req: Request, res: Response) => {
        try {
            const user = req.user as User;

            // handle the google callback, generate auth token
            const { authToken } = AuthService.handleGoogleCallback(user);

            // redirect to frontend with the accessToken as query param
            const redirectUrl = `${process.env.FE_BASE_URL}?accessToken=${authToken}`;
            return res.redirect(redirectUrl);
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred during authentication', error });
        }
    }
);

export default router;