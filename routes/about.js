
var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

router.get('/about', function(req, res, next) {
  res.render('about', {
    user: req.user
  });
});

module.exports = router;