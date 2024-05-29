const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../User/user.model')
const { signToken } = require('./auth.service')
require('dotenv').config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENTE_SECRETE,
      callbackURL: '/api/users/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log('Access Token:', accessToken)
      console.log('Profile:', profile)
      try {
        // Aquí puedes verificar o crear el usuario en tu base de datos
        let user = await User.findOne({
          googleId: profile.id
        })

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.given_name,
            lastname: profile.family_name,
            email: profile.email
          })
          const payload = {
            id: user.googleId,
            role: user.role
          }
          user.token = signToken(payload)
          await user.save()
        }
        console.log(user)
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
