const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

var router = express.Router();

/* POST login. */
router.post("/login", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: err
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      const options = {
        subject: user.api_key, 
        issuer: 'payor-example', 
        expiresIn: '4h'
      };
      const token = jwt.sign({}, process.env.JWT_SECRET, options);
      return res.json({ token });
    });
  })(req, res);
});

module.exports = router;