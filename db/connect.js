const mysql = require('mysql');

const DBConnection = mysql.createConnection({
  host: "localhost",
  user: "matcha",
  password: "Matcha@2020!",
  database: "matcha_db"
});

DBConnection.connect(function(err) {
  if (err)
     console.log(err);
  else
     console.log("LocalHost Connected!");
});
module.exports = DBConnection;