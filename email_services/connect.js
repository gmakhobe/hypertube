const mysql = require('mysql');

const DBConnection = mysql.createConnection({
  host: "remotemysql.com",
  user: "Mp7kXc7jx7",
  password: "n45BSAzqyA",
  database: "Mp7kXc7jx7"
});

DBConnection.connect(function(err) {
  if (err)
     console.log(err);
  else
     console.log("LocalHost Connected!");
});
module.exports = DBConnection;