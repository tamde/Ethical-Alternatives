var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

router.get('/recipe', function (req, res, next) {

    /*
      Passport will populate the request with the user object when user has authenticated
      We can check if req.user is defined to get the logged-in user's id, username, nickname
      Print values to console for now
    */
    if (req.user) {
        console.log("/> User: " + JSON.stringify(req.user, null, 2));
    }

    res.render('recipe', {
        user: req.user
    });
});


module.exports = router;