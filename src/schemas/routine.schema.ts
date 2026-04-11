import { z } from 'zod';

export const createRoutineSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
        description: z.string().optional(),
    })
});

export const updateRoutineSchema = z.object({
    body: createRoutineSchema.shape.body.partial()
});

export const addOrRemoveTaskToRoutineSchema = z.object({
    body: z.object({
        taskId: z.uuid().min(1, 'O id da tarefa é obrigatório')
    }),
    params: z.object({
        id: z.uuid().min(1, 'O id da rotina é obrigatório')
    })
});

export const getRoutineByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, 'O id da rotina é obrigatório')
    })
});