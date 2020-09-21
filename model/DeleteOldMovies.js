const orm = require("./orm-model");
const fs = require('fs');

exports.DeleteOldContents = () => {

    let d = new Date();

    //console.log('Today is: ' + d.toLocaleString());
    //Subtract 30 days from todays date
    d.setDate(d.getDate() - 30);
    let newDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

    orm.SELECT(`SELECT * FROM Movies WHERE DateViews < "${newDate}"`)
        .then(data => {

            for (let index = 0; index < data.length; index++) {

                fs.unlink(`public/${data[index].Location}`, (error) => {

                    if (error) {
                        console.log(`Failed to delete ${data[index].MovieName} with a location of ${data[index].Location}`);
                    } else {
                        console.log(`Movie MP4 Deleted: ${data[index].MovieName}`);
                        orm.DELETE(`DELETE FROM Movies WHERE MovieId = "${data[index].MovieId}"`)
                            .then(res1 => {
                                //Print
                                console.log(`Movie Deleted From Movies: ${data[index].MovieName}`);
                                orm.DELETE(`DELETE FROM MyMovies WHERE MovieId = "${data[index].MovieId}"`)
                                    .then(res2 => {
                                        //Log
                                        console.log(`Movie Deleted From MyMovies: ${data[index].MovieName}`);

                                    })
                                    .catch(res2 => {
                                        //Log
                                        console.log(`Movie Failed To Deleted From MyMovies: ${data[index].MovieName}`);

                                    });

                            })
                            .catch(res => console.log(`Movie Failed To Delete: ${data[index].MovieName}`));
                    }

                });

            }

        })
        .catch(data => {
            console.log("No action took place due to detected error");
        });
}