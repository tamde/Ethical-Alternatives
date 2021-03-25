const LocalStrategy = require('passport-local').Strategy;
const md5 = require('md5');
const mysql = require('./dbcon.js');

function initialize(passport) {

  // Callback function to authenticate user & call done
  function authenticateUser(log_username, log_password, done) {

    var sql_query = "SELECT * FROM `Users` WHERE `username` = ?";

    mysql.pool.query(sql_query, [log_username], function(err, result) {
      if (err) {
        return done(err);
      }

      // If user not found in database return error
      if (result.length == 0) {
        return done(null, false, { message: 'Username not found' });
      } else {
        const user = {
          id: result[0].ID,
          username: result[0].username,
          password: result[0].password,
          nickname: result[0].nickname
        };

        if (md5(log_password) === user.password) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      }
    });
  }

  passport.use(new LocalStrategy(
    { usernameField: 'log_username', passwordField: 'log_password' },
    authenticateUser)
  );

  // used to serialize the user for the session
  passport.serializeUser(
    function(user, done) {
      return done(null, user.id);
    });

  // used to deserialize the user
  passport.deserializeUser(
    function(id, done) {

      var sql_query = "select * from `Users` where `id` = ?";

      mysql.pool.query(sql_query, [id], function(err, result) {
        if (err) {

          return done(err);
        }

        user = {
          id: result[0].id,
          username: result[0].username,
          password: result[0].password,
          nickname: result[0].nickname
        };

        return done(null, result[0]);
      });
    }
  );
}

module.exports = initialize