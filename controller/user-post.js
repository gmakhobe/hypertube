const valiator = require("../assets/validators");
const orm = require("../model/orm-model");

exports.Logout = (req, res) => {
    const username = req.body.username;

    if (!valiator.isUsername){
        res.send({
            "status": 0,
            "message": `An error occured please try again [Server Error]!`
        });
    }
    orm.UPDATE(`UPDATE Users SET LoginStatus = 0 WHERE Username = "${username}"`).then((message) => {
        console.log("Affected rows:");
        console.log(message);
        res.send({
            "status": 1,
            "message": `Success`
        });
        return ;
    }).catch((error) => {
        console.log(error)
    });
}