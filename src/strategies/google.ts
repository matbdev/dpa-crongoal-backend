import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { prisma } from "../config/prisma"

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BE_BASE_URL}/api/auth/google/callback`,
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
            const email = profile.emails?.[0]?.value || "";
            // Check if a user with this email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                // Link Google account to the existing user
                user = await prisma.user.update({
                    where: { email },
                    data: { 
                        googleId: profile.id,
                        picUrl: existingUser.picUrl || profile.photos?.[0]?.value || "",
                        provider: existingUser.provider === "google" ? "google" : "local,google"
                    }
                });
            } else {
                // create new user if doesn't exist
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: email,
                        fullName: profile.displayName || "Google User",
                        picUrl: profile.photos?.[0]?.value || "",
                        displayName: profile.username || profile.name?.givenName || "",
                        provider: "google"
                    }
                });
            }
        }

        // auth the User
        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}

export default new GoogleStrategy(options, verify);
