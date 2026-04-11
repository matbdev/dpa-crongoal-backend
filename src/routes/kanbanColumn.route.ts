import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import * as KanbanColumnController from '../controllers/kanbanColumn.controller';
import { validate } from '../middlewares/validateData';
import { createKanbanColumnSchema, updateKanbanColumnSchema, getKanbanColumnByIdSchema, getKanbanColumnByProjectSchema } from '../schemas/kanban.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
router.get('/project/:projectId', validate(getKanbanColumnByProjectSchema), KanbanColumnController.getByProject);
router.get('/:id', validate(getKanbanColumnByIdSchema), KanbanColumnController.getById);
router.post('/', validate(createKanbanColumnSchema), KanbanColumnController.create);
router.put('/:id', validate(updateKanbanColumnSchema), KanbanColumnController.update);
router.delete('/:id', validate(getKanbanColumnByIdSchema), KanbanColumnController.remove);

export default router;
