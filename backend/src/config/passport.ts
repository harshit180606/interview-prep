import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from '../lib/prisma'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'https://interview-prep-backend-ro35.onrender.com/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value ?? '',
        }
      })
    }

    done(null, user)
  } catch (error) {
    done(error, undefined)
  }
}))

export default passport