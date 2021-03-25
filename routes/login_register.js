/* Login, register route */

const express = require('express');
const router = express.Router();
const mysql = require('./dbcon.js');
const passport = require('passport');
const flash = require('express-flash');
const md5 = require('md5');
const initPassport = require('./passport-config');

// Initialize passport module used for authentication
initPassport(passport);

// Used to show authentication error messages
router.use(flash());

// Only render login_register page if user is not logged in
router.get('/login_register', checkNotAuthenticated, function(req, res, next) {
  res.render('login_register');
});

// Only render profile page if user is logged in
router.get('/profile', checkAuthenticated, function(req, res, next) {
  res.render('profile', {
    user: req.user
  });
});

// Profile post route
router.post('/profile', checkAuthenticated, function(req, res, next) {

  var cur_password = md5(req.body['cur_password']);
  var new_password = null;
  if (req.body['new_password']) {
    new_password = md5(req.body['new_password']);
  }
  var nickname = req.body['nickname'];
  
  if (cur_password !== req.user.password) {
    var err_msg = "Incorrect password entered, changes not saved!"
    res.render('profile', { reg_error: err_msg, user: req.user });
    return;
  }
  
  var sql_query = "UPDATE `Users` SET nickname= '" + nickname + "'";
  if (new_password) {
    sql_query += " ,password= '" + new_password + "'";
  }
  sql_query += " WHERE id= " + req.user.ID;
  mysql.pool.query(sql_query, function(err, result) {
    if (err) {
      //console.log("[DEBUG] mysql err: " + JSON.stringify(err, null, 2));
      next(err);
      return;
    }
    
    // Update the nickname of user object
    req.user.nickname = nickname;
    
    // Print status message on screen
    var status_msg = "Profile updated successfully"
    res.render('profile', { reg_success: status_msg, user: req.user });
  });
  
});

// Login post route is handled by passport using the local strategy defined in ./passport-config
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login_register',
  failureFlash: true
})
);

// Register post route with database
router.post('/register', checkNotAuthenticated, function(req, res, next) {

  // New user object with md5 hashed password
  var newUser = {
    username: req.body['reg_username'],
    password: md5(req.body['reg_password']),
    nickname: req.body['reg_nickname']
  }

  // Check if username already registered in database
  var sql_query = "SELECT `username` FROM `Users` WHERE username=?";
  mysql.pool.query(sql_query, [newUser.username], function(err, result) {

    if (err) {
      //console.log("[DEBUG] mysql err: " + JSON.stringify(err, null, 2));
      next(err);
      return;
    }

    // If username exists, print error message to page
    if (result.length > 0) {
      status_msg = "Username " + newUser.username + " already registered"
      res.render('login_register', { reg_error: status_msg });
      return;
    } else {
      // If username is new, create new account in database
      sql_query = "INSERT INTO `Users` (`username`, `password`, `nickname`) VALUES (?, ?, ?)";

      mysql.pool.query(
        sql_query, [newUser.username, newUser.password, newUser.nickname],
        function(err, result) {
          if (err) {
            next(err);
            return;
          }

          // Populate ID field of user object
          newUser.id = result.insertId;

          // Print status message on screen
          status_msg = "Username " + newUser.username + " registered successfully"
          res.render('login_register', { reg_success: status_msg });
        });

      //console.log("[DEBUG] New registered user: " + JSON.stringify(newUser, null, 2));
    }
  });
});


// Logout route
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// If user is authenticated redirect to home page, else do nothing
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

// If user is not authenticated redirect to home page, else do nothing
function checkAuthenticated(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
