import { z } from 'zod';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "É obrigatório informar um título com pelo menos 1 caractere"),
        description: z.string().optional(),
        type: z.enum(["UNIQUE", "RECURRENT"]),
        generatedPoints: z.number().int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto"),
        columnId: z.uuid().optional()
    })
});

export const updateTaskSchema = z.object({
    body: createTaskSchema.shape.body.partial(),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da tarefa")
    })
});

export const moveToColumnSchema = z.object({
    body: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da tarefa"),
        newColumnId: z.uuid().min(1, "É obrigatório informar o id da nova coluna")
    })
});

export const createDailyRegisterSchema = z.object({
    body: z.object({
        taskId: z.uuid().min(1, "É obrigatório informar o id da tarefa"),
        isDone: z.boolean().optional(),
        obs: z.string().optional()
    })
});

export const getTaskByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da tarefa")
    })
});