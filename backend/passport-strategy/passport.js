var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const User = require("../db/User.Schema")
module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log({ profile, refreshToken, accessToken })
      User.findOne({ email: profile._json.email.toLowerCase() })
        .then(async (newUser) => {
          if (newUser) {
            return done(null, newUser)
          }
          else {
            const user = await new User({
              name: profile.name.givenName,
              lname: profile.name.familyName,
              password: profile.id,
              provider: profile.provider,
              email: profile._json.email.toLowerCase(),
              pic: profile._json.picture,
              verify: profile._json.verify,
              userId: Math.floor(Math.random() * 100000),
              createdAt: new Date(),
            })
            user.save()
              .then(async () => {
                const user = await User.findOne({ email: profile._json.email })
                return done(null, user)
              })
              .catch((err) => {
                if (err) {
                  console.log(err)
                  console.log("user is not save")
                  return done(null, false)
                }
              })
          }
        })
        .catch(err => {
          if (err) {
            return done(null, false)
          }
        })
    }
  ));
  passport.serializeUser(function (user, done) {
    console.log({ user }, "serieal")
    console.log("serielize")
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    console.log({ id })
    User.findById({ _id: id })
      .then((user) => {
        console.log({ user })
        done(null, user);
      })
      .catch(err => {
        done(null, false, { error: err });
      })
  });
}
