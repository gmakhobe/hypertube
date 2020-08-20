const mysql = require('mysql');
const DBConnection = require('./connect');

const DBCreate = function(){
    DBConnection.query("CREATE DATABASE IF NOT EXISTS matcha_db", function (err, result) {
        if (err)
            console.log(err);
        else
            console.log("Database created");
    });
};
module.exports = DBCreate;
 