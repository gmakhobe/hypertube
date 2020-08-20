const mysql = require('mysql');

  //Create Pool Connection
const pool = mysql.createPool({  
  host: "remotemysql.com",
  user: "Mp7kXc7jx7",
  password: "n45BSAzqyA",
  database: "Mp7kXc7jx7"
});

exports.dbCon = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error){
        console.log("Connection Log:");
        console.log(error);
        reject(error);
      }else{
        resolve(connection);
      }
    });
  });
}