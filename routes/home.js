/* Home route */

require('dotenv').config();

var express = require('express');
var router = express.Router();

const passport = require('passport');
const session = require('express-session');

router.use(session({
  secret: process.env.SESSION_SECRET, // Use secret from .env file
  resave: false,
  saveUninitialized: false
}))

router.use(passport.initialize());
router.use(passport.session());

router.get('/',function(req,res,next) {
  
  res.render('home', {user: req.user});
});

module.exports = router;
