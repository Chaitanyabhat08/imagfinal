const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/user");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'JOWIJEFJI323JOJOF329939JKKJF';

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {usernameField: 'email'},
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.comparePassword(password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
          })
          .catch((err) => done(err));
      }
    )
  );

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const emailId = jwt_payload.email;
      User.findOne({ email: emailId })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => done(err, false));
    })
  );
};
