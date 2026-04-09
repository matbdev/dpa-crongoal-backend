/*
Ação loginGoogle: Recebe o código do Google.
Bate na API do Google para resgatar os dados do usuário.
Verifica no Prisma se já existe alguém com aquele googleId ou email.
Se não existir, cria a conta. No fim, gera o seu JWT e devolve.
*/

import { User } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { hashPassword, checkPassword } from "../utils/password";
import { generateJwtToken } from "../utils/jwt";

/*
 * Function that register user
 * Returns the created or found user
 * Propagates an error if the password is incorrect
 * @param email - user email
 * @param password - user hashed password
 */
export async function localRegister(email: string, password: string) {
    try {
        const foundUser = await getUserByLocalCredentials(email, password);

        if (foundUser === null) {
            // Creates user if it doesn't exists
            const hashedPassword: string = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email: email,
                    hashPassword: hashedPassword,
                    fullName: "Mateus"
                }
            });

            return user;
        };

        throw new Error("The user already exists. Please, log in.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unexpected error occurred", error);
        }
    }
}

/*
 * Function that register user
 * Returns the created or found user
 * Propagates an error if the password is incorrect
 * @param email - user email
 * @param password - user hashed password
 */
export async function loginLocal(email: string, password: string) {
    try {
        const foundUser = await getUserByLocalCredentials(email, password);

        if (foundUser !== null) {
            return generateJwtToken(foundUser);
        };

        throw new Error("The user was not found. Register first or authenticate.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unexpected error occurred", error);
        }
    }
}

/*
 * Function that search database for the user
 * Throws an error if the password is incorrect
 * @param email - user email
 * @param password - user hashed password
 */
async function getUserByLocalCredentials(email: string, password: string): Promise<User | null> {
    const foundUser = await prisma.user.findFirst({
        where: { email: email }
    });

    const isUserValid = await checkPassword(password, foundUser?.hashPassword as string);

    if (!isUserValid) {
        throw new Error("Invalid credentials. Please, try again!")
    }

    return foundUser;
}

export function handleGoogleCallback(user: User) {
    // Passamos o usuário inteiro para a função que já existe e sabe gerar o token
    const authToken = generateJwtToken(user);

    return { authToken };
}
