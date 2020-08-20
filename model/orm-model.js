const sql = require('../config/connect');
//Start Connection
exports.StartConnection = () => {
    return new Promise((resolve, reject) => {
        sql.dbCon()
        .then(connection => {
            connection.release();
            resolve("Connection Started");    
        })
        .catch(message => {
            reject("Connection failed to start");
        });
    });
}

//CREATE
exports.INSERT = (myQuery) => {
    return new Promise((resolve, reject) => {
        sql.dbCon()
        .then(connection => {
            connection.query(myQuery, (error, result, fields) => {
                connection.release();
                if (error){
                    console.log("Connection Log 3 (Insert):");
                    console.log(error);
                    reject("An error occured related to the server.");
                }else{
                    resolve(result.affectedRows);
                }
            });
        })
        .catch(message => {
            console.log("Connection Log 2:");
            console.log(message);
            reject("An error occured please try again!");
        });
    });
}
//READ
exports.SELECT = (myQuery) => {
    return new Promise((resolve, reject) => {
        sql.dbCon()
        .then(connection => {
            connection.query(myQuery, (error, result, fields) => {
                connection.release();
                if (error){
                    console.log("Connection Log 4 (Select):");
                    console.log(error);
                    reject("An error occured related to the server.");
                }else{
                    resolve(result);
                }
            });
        })
        .catch(message => {
            console.log("Connection Log 5:");
            console.log(message);
            reject("An error occured please try again!");
        });
    });
}

exports.UPDATE = (myQuery) => {
    return new Promise((resolve, reject) => {
        sql.dbCon()
        .then(connection => {
            connection.query(myQuery, (error, result, fields) => {
                connection.release();
                if (error){
                    console.log("Connection Log 6 (Select):");
                    console.log(error);
                    reject("An error occured related to the server.");
                }else{
                    resolve(result.changedRows);
                }
            });
        })
        .catch(message => {
            console.log("Connection Log 7:");
            console.log(message);
            reject("An error occured please try again!");
        });
    });
}

exports.DELETE = (myQuery) => {
    return new Promise((resolve, reject) => {
        sql.dbCon()
        .then(connection => {
            connection.query(myQuery, (error, result, fields) => {
                connection.release();
                if (error){
                    console.log("Connection Log 8 (Select):");
                    console.log(error);
                    reject("An error occured related to the server.");
                }else{
                    resolve(result.affectedRows);
                }
            });
        })
        .catch(message => {
            console.log("Connection Log 8:");
            console.log(message);
            reject("An error occured please try again!");
        });
    });
}
