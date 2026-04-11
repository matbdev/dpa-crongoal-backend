import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        displayName: z.string().min(2, "É obrigatório informar um nome de usuário com pelo menos 2 caracteres").optional(),
        picUrl: z.url("É obrigatório informar uma url válida").optional(),
        theme: z.enum(["DARK", "LIGHT"]).optional()
    })
});
