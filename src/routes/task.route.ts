import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import * as TaskController from '../controllers/task.controller';
import { validate } from '../middlewares/validateData';
import { createTaskSchema, updateTaskSchema, moveToColumnSchema, createDailyRegisterSchema, getTaskByIdSchema } from '../schemas/task.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
// Delegates the request to the controller
router.get('/', TaskController.getAll);
router.get('/daily', TaskController.getAllDailyTasks);
router.get('/count', TaskController.getCount);
router.get('/:id', validate(getTaskByIdSchema), TaskController.getById);
router.post('/', validate(createTaskSchema), TaskController.create);
router.post('/daily', validate(createDailyRegisterSchema), TaskController.createDailyRegister);
router.put('/move', validate(moveToColumnSchema), TaskController.moveToColumn);
router.put('/:id', validate(updateTaskSchema), TaskController.update);
router.delete('/:id', validate(getTaskByIdSchema), TaskController.remove);

export default router;
