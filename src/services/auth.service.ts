import { User } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import { hashPassword, checkPassword } from "../utils/password";
import { generateJwtToken } from "../utils/jwt";

export async function localRegister(email: string, password: string, fullName: string) {
    // Verify if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error("The user already exists. Please, log in.");
    }

    // Create user
    const hashedPassword: string = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email: email,
            hashPassword: hashedPassword,
            fullName: fullName
        }
    });

    return generateJwtToken(user);
}

export async function loginLocal(email: string, password: string) {
    const foundUser = await prisma.user.findUnique({
        where: { email: email }
    });

    // Verify if user exists and has a password
    if (!foundUser || !foundUser.hashPassword) {
        throw new Error("The user was not found or invalid credentials.");
    }

    // Verify password
    const isUserValid = await checkPassword(password, foundUser.hashPassword);

    if (!isUserValid) {
        throw new Error("Invalid credentials. Please, try again!");
    }

    // Generate token
    return generateJwtToken(foundUser);
}

export function handleGoogleCallback(user: User) {
    return generateJwtToken(user);
}
