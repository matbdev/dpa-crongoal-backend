import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/jwtPayload';
import { User } from '../../generated/prisma/client';

// Environment variables
const defaultJwtSecretKey: string = "EnMePo2elkebPR9bApfF0HGbl1CEo9FUciqUACf6WFhmTGTT0bQBaYitUT5wir4X9MW2Xf8gSqiFPUMQg2B6pcQcUQqz4mJLj1pT";
const jwtExpirationTime: string = process.env.JWT_EXPIRATION_TIME || "24h";
const secretKey: string = process.env.JWT_SECRET || defaultJwtSecretKey;

export function generateJwtToken(user: User): string {
    const payload: CustomJwtPayload = {
        userId: user.id,
        role: user.role,
        displayName: user.displayName || "",
        picUrl: user.picUrl || ""
    };

    const token: string = jwt.sign(payload, secretKey, {
        expiresIn: jwtExpirationTime as SignOptions['expiresIn'],
        algorithm: 'HS256' // Default signing algorithm
    });

    return token;
}
