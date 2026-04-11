import { z } from 'zod';

export const createRewardSchema = z.object({
    body: z.object({
        title: z.string().min(3, "É obrigatório informar um título com pelo menos 3 caracteres"),
        description: z.string().optional(),
        pointsToGet: z.number().int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto"),
        icon: z.string().optional()
    })
});

export const updateRewardSchema = z.object({
    body: createRewardSchema.shape.body.partial(),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da recompensa")
    })
});

export const getRewardByIdSchema = z.object({
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da recompensa")
    })
});

export const redeemRewardSchema = z.object({
    body: z.object({
        spentPoints: z.number().int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto")
    }),
    params: z.object({
        id: z.uuid().min(1, "É obrigatório informar o id da recompensa")
    })
});