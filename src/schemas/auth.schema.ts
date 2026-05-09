import { z } from 'zod';

const hasSequentialNumbers = /(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/;

export const registerSchema = z.object({
    body: z.object({
        email: z.email("Formato de e-mail inválido"),
        password: z.string()
            .min(8, "A senha deve ter no mínimo 8 caracteres")
            .max(100, "A senha é muito longa")
            .refine((password) => !hasSequentialNumbers.test(password), {
                message: "A senha não pode conter números sequenciais"
            }),
        fullName: z.string()
            .min(2, "Você precisa informar um nome real")
            .max(150, "Nome muito longo"),
        displayName: z.string()
            .min(2, "O apelido deve ter no mínimo 2 caracteres")
            .max(50, "Apelido muito longo")
            .optional()
    })
}).refine(
    (data) => {
        const nameParts = data.body.fullName.toLowerCase().split(' ').filter(n => n.length >= 3);
        const pass = data.body.password.toLowerCase();

        for (const part of nameParts) {
            if (pass.includes(part)) return false;
        }
        return true;
    },
    {
        message: "Por segurança, a senha não pode conter partes do seu nome",
        path: ["body", "password"]
    }
);

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Formato de e-mail inválido"),
        password: z.string().min(1, "A senha é obrigatória")
    })
});
