import { z } from 'zod';

export const createKanbanColumnSchema = z.object({
    body: z.object({
        name: z.string().min(1, "É obrigatório informar o título da coluna"),
        order: z.number().min(0, "É obrigatório informar a ordem da coluna"),
        projectId: z.uuid().min(1, "É obrigatório informar o id do projeto"),
        color: z.string().optional(),
    })
});

export const updateKanbanColumnSchema = z.object({
    body: createKanbanColumnSchema.shape.body.partial(),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da coluna")
    })
});

export const getKanbanColumnByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da coluna")
    })
});

export const getKanbanColumnByProjectSchema = z.object({
    params: z.object({
        projectId: z.uuid().min(1, "É obrigatório informar o id do projeto")
    })
});