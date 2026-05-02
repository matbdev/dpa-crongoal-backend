import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import * as ProjectController from '../controllers/project.controller';
import { validate } from '../middlewares/validateData';
import { createProjectSchema, updateProjectSchema, getProjectByIdSchema } from '../schemas/project.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
// Delegates the request to the controller
router.get('/count', ProjectController.getCount);
router.get('/', ProjectController.getAll);
router.post('/', validate(createProjectSchema), ProjectController.create);

// Routes with id
router.get('/:id', validate(getProjectByIdSchema), ProjectController.getById);
router.put('/:id', validate(updateProjectSchema), ProjectController.update);
router.delete('/:id', validate(getProjectByIdSchema), ProjectController.remove);

export default router;
