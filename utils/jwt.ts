import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/jwt_payload';
import { User } from '../generated/prisma/client';

// Environment variables
const defaultJwtSecretKey: string = "EnMePo2elkebPR9bApfF0HGbl1CEo9FUciqUACf6WFhmTGTT0bQBaYitUT5wir4X9MW2Xf8gSqiFPUMQg2B6pcQcUQqz4mJLj1pT";
const jwtExpirationTime: string = process.env.JWT_EXPIRATION_TIME || "1h";
const secretKey: string = process.env.JWT_SECRET || defaultJwtSecretKey;

export function generateJwtToken(user: User): string {
    const payload: CustomJwtPayload = {
        userId: user.id,
        role: user.role
    };

    const token: string = jwt.sign(payload, secretKey, {
        expiresIn: jwtExpirationTime as SignOptions['expiresIn'],
        algorithm: 'HS256' // Default signing algorithm
    });

    return token;
}

export function validateJwtToken(token: string): CustomJwtPayload | null {
    try {
        // verify() verifies expired, malformed or changed sign token
        const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
        return decoded;

    } catch (error) {
        // Error 401
        console.error('Invalid or Expired Token:', (error as Error).message);
        return null;
    }
}