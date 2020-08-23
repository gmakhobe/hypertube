const mysql = require('mysql');

  //Create Pool Connection
const pool = mysql.createPool({  
  host: "localhost",
  user: "root",
  password: "",
  database: "HypertubeApp"
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