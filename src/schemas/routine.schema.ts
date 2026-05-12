import { z } from 'zod';

export const createRoutineSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
        description: z.string().optional(),
        taskIds: z.array(z.uuid()).min(1, 'É obrigatório selecionar pelo menos uma tarefa'),
    })
});

export const updateRoutineSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
        description: z.string().optional(),
        taskIds: z.array(z.uuid()).min(1, 'É obrigatório selecionar pelo menos uma tarefa'),
    }),
    params: z.object({
        id: z.uuid().min(1, 'O id da rotina é obrigatório')
    })
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