import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import * as RoutineController from '../controllers/routine.controller';
import { validate } from '../middlewares/validateData';
import { createRoutineSchema, updateRoutineSchema, addOrRemoveTaskToRoutineSchema, getRoutineByIdSchema } from '../schemas/routine.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
// Delegates the request to the controller
router.get('/', RoutineController.getAll);
router.get('/:id', validate(getRoutineByIdSchema), RoutineController.getById);
router.post('/', validate(createRoutineSchema), RoutineController.create);
router.put('/:id', validate(updateRoutineSchema), RoutineController.update);
router.post('/task', validate(addOrRemoveTaskToRoutineSchema), RoutineController.addTask);
router.delete('/task', validate(addOrRemoveTaskToRoutineSchema), RoutineController.removeTask);
router.delete('/:id', validate(getRoutineByIdSchema), RoutineController.deleteRoutine);

export default router;
