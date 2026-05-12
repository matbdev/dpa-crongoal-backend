import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().min(3, "É obrigatório informar um título com pelo menos 3 caracteres").max(100, "É obrigatório informar um título com no máximo 100 caracteres"),
        description: z.string().max(255, "É obrigatório informar uma descrição com no máximo 255 caracteres").optional(),
        limitDate: z.coerce.date({ message: "Insira uma data válida" }).min(new Date(new Date().setHours(0, 0, 0, 0)), "É obrigatório informar uma data limite"),
        taskIds: z.array(z.uuid()).min(1, 'É obrigatório selecionar pelo menos uma tarefa'),
    })
});

export const updateProjectSchema = z.object({
    body: z.object({
        title: z.string().min(3, "É obrigatório informar um título com pelo menos 3 caracteres").max(100, "É obrigatório informar um título com no máximo 100 caracteres").optional(),
        description: z.string().max(255, "É obrigatório informar uma descrição com no máximo 255 caracteres").optional(),
        limitDate: z.coerce.date({ message: "Insira uma data válida" }).optional(),
        taskIds: z.array(z.uuid()).min(1, 'É obrigatório selecionar pelo menos uma tarefa'),
    }),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id do projeto")
    })
});

export const getProjectByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id do projeto")
    })
});