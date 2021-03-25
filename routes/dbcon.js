var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_damlek',
  password        : '0902',
  database        : 'cs361_damlek'
});

module.exports.pool = pool;