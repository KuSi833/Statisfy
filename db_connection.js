var mysql = require('mysql');

var con = mysql.createConnection({
  host: "dbhost.cs.man.ac.uk",
  user: "USER",
  password: "PASSWORD",
  database: "2020_comp10120_w4"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});