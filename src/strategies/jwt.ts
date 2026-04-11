import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { prisma } from "../config/prisma";
import { CustomJwtPayload } from '../types/jwtPayload';

const defaultJwtSecretKey = "EnMePo2elkebPR9bApfF0HGbl1CEo9FUciqUACf6WFhmTGTT0bQBaYitUT5wir4X9MW2Xf8gSqiFPUMQg2B6pcQcUQqz4mJLj1pT";

// Already checks if JWT is valid
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || defaultJwtSecretKey,
};

async function verify(payload: CustomJwtPayload, done: VerifiedCallback) {
    try {
        // verifies critical fields
        if (!payload?.userId || !payload?.role) {
            return done(null, false); // auth failed
        }

        // verifies if user exists
        const user = await prisma.user.findFirst({
            where: { id: payload.userId },
        });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);

    } catch (error) {
        return done(error, false);
    }
}

export default new Strategy(options, verify);
