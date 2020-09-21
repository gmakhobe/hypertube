const mysql = require('mysql');

const dbInfo = {
  host: "localhost",
  user: "root",
  password: "",
  database: "HypertubeApp"
}

  //Create Pool Connection
const pool = mysql.createPool({  
  host: dbInfo.host,
  user: dbInfo.user,
  password: dbInfo.password,
  database: dbInfo.database
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

exports.dbInfoall = dbInfo; 