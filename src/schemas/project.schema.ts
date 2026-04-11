import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().min(3, "É obrigatório informar um título com pelo menos 3 caracteres").max(100, "É obrigatório informar um título com no máximo 100 caracteres"),
        description: z.string().max(255, "É obrigatório informar uma descrição com no máximo 255 caracteres").optional(),
        limitDate: z.date().min(new Date(), "É obrigatório informar uma data limite")
    })
});

export const updateProjectSchema = z.object({
    body: createProjectSchema.shape.body.partial(),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id do projeto")
    })
});

export const getProjectByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id do projeto")
    })
});