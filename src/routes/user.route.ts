import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import { requireAdmin } from '../middlewares/requireAdmin';
import * as UserController from '../controllers/user.controller';
import { validate } from '../middlewares/validateData';
import { updateProfileSchema } from '../schemas/user.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
// Delegates the request to the controller
router.get('/', UserController.getProfile);
router.put('/', validate(updateProfileSchema), UserController.updateProfile);
router.delete('/', UserController.deleteAccount);

// Admin routes
router.get('/admin/all', requireAdmin, UserController.getAll);

export default router;