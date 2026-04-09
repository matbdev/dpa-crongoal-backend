import { prisma } from "../config/prisma";

export async function getUser(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    });

    return user;
}