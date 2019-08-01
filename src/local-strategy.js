const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const db = require("./db");
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, cb) => {
      return db
        .one("SELECT * FROM users WHERE username = $1", [username])
        .then(function(user) {
          if (!user) {
            return cb({ message: "Incorrect email or password" }, false);
          }
          if (bcrypt.compareSync(password, user.password)) {
            return cb(null, user);
          }
          return cb({ message: "Incorrect email or password." }, false);
        })
        .catch(function(error) {
          return cb({ message: "Incorrect email or password.." }, false);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    function(jwtPayload, cb) {
      return db
        .one("SELECT * FROM users WHERE api_key = $1", [jwtPayload.sub], (user) => {
          return {key: user.key};
        })
        .then(function(user) {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          return cb(null, user);
        })
        .catch(function(error) {
          return cb(error);
        });
    }
  )
);
