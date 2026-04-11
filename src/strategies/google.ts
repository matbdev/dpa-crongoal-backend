import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { prisma } from "../config/prisma"

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BE_BASE_URL}/api/oauth/google/callback`,
};

async function verify(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    try {
        // we check for if the user is present in our database
        let user = await prisma.user.findFirst({
            where: {
                googleId: profile.id,
            },
        });

        // if not
        if (!user) {
            // create new user if doesn't exist
            user = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value || "",
                    fullName: profile.displayName,
                    picUrl: profile.photos?.[0].value || "",
                    displayName: profile.username || "",
                    provider: "google"
                }
            });
        }

        // auth the User
        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}

export default new GoogleStrategy(options, verify);
