import { Router } from 'express';
import passport from '../strategies/passport';
import * as AuthController from '../controllers/auth.controller';
import { validate } from '../middlewares/validateData';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

// Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    AuthController.googleCallback
);

// Local login and register
router.post('/login', validate(loginSchema), AuthController.localLogin);
router.post('/register', validate(registerSchema), AuthController.localRegister);

export default router;