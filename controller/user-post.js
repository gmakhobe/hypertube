const validator = require("../assets/validators");
const orm = require("../model/orm-model");
const bcrypt = require('bcryptjs');
const AppName = "Hypertube";
const fetch = require('node-fetch');
const envTheMovieDb = require('../envTheMovieDB');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const rootPath = process.cwd();

//Stream a movie
exports.movieStream = (req, res) => {
    const magnet = `${req.body.magnet}&dn=${req.body["amp;dn"]}&tr=${req.body["amp;tr"][0]}&tr=${req.body["amp;tr"][1]}&tr=${req.body["amp;tr"][2]}&tr=${req.body["amp;tr"][3]}&tr=${req.body["amp;tr"][4]}&tr=${req.body["amp;tr"][5]}&tr=${req.body["amp;tr"][6]}&tr=${req.body["amp;tr"][7]}`;
    const movieName = req.body.MovieName;
    const movieId = req.body.MovieID;
    const imgURL = req.body.imgURL;

    //console.log(req.body);

    //console.log(`Movie Name: ${movieName}, Movie Id: ${movieId}, Magnet: ${magnet}`);
    orm.SELECT(`SELECT * FROM Movies WHERE MovieId = '${movieId}' AND DeleteInd = 0;`)
        .then(res1 => {

            if (res1.length == 0) {

                //Torrent stream init
                const engine = torrentStream(magnet);
                //When ready create access to files
                engine.on('ready', () => {

                    //Go through each file file
                    engine.files.forEach(file => {

                        //Create readStream
                        const stream = file.createReadStream();

                        //If the below files are found stream
                        if (file.name.search('.mp4') >= 0 || file.name.search('.mkv') >= 0 || file.name.search('.ogv') >= 0 || file.name.search('.webm') >= 0 || file.name.search('.webvtt') >= 0) {

                            //Create a directory for the video
                            fs.mkdir('public/movies/' + file.name, { recursive: true }, (error) => {
                                //If there is an error
                                if (error) {
                                    console.log("[System Permission] Failed to create movies directory");
                                    return res.send({
                                        status: 0,
                                        message: "System prevented Hypertube to create directories!"
                                    });
                                } else {

                                    console.log("Path created!");

                                    let videoPath = rootPath + "/public/movies/" + file.name + "/video.mp4";
                                    const writer = fs.createWriteStream(videoPath);
                                    videoPath = "movies/" + file.name + "/video.mp4";

                                    let indicator = 1;

                                    stream.on('data', data => {
                                        writer.write(data);

                                        if (indicator < 2) {

                                            //Insert path into the Movies table
                                            orm.INSERT(`INSERT INTO Movies (MovieId, MovieName, Location, Magnet, DeleteInd, MovieURL) VALUES('${movieId}', "${movieName}", "${videoPath}", "${magnet}", 0, "${imgURL}");`)
                                                .then(res1 => {

                                                    let $Key = 0;

                                                    //Set session
                                                    if (!validator.isObjEmpty(req.session.user)) {
                                                        //Set variable 
                                                        $Key = req.session.user.id;
                                                    }

                                                    if (!validator.isObjEmpty(req.session.passport)) {
                                                        //Set variable
                                                        $Key = req.session.passport.user.id;
                                                    }

                                                    orm.INSERT(`INSERT INTO MyMovies(MovieId, UserId) VALUES('${movieId}', (SELECT UserID FROM Users WHERE EmailAddress = '${$Key}' OR IntraID = '${$Key}'))`)
                                                    .then(res3 => {
                                                            console.log(`${movieId} added to MyMovies`);
                                                    })
                                                    .catch(res3 => {
                                                            console.log(`Failed to add ${movieId} to MyMovies`);

                                                            console.log(res3);
                                                    });
                                                    //MyMovies
                                                    //TableId, MovieId, MovieName, 

                                                })
                                                .catch(res2 => {
                                                    console.log("Failed to memorise movie name");
                                                    console.log(res2);
                                                });

                                            //Return response
                                            res.send({
                                                status: 1,
                                                message: "success!",
                                                url: videoPath
                                            });

                                            indicator++;
                                            console.log("Movie Downloading...");
                                        }
                                    });

                                }


                            });

                        }

                    });

                })

            } else {

                console.log("Playing already downloaded movie");

                orm.SELECT(`SELECT * FROM Movies WHERE MovieId = ${movieId};`)
                .then(res4 => {

                    console.log("Sending link to user");

                    //Return response
                    res.send({
                        status: 1,
                        message: "success!",
                        url: res4[0].Location
                    });

                })
                .catch(res4 => {
                    
                    res.redirect('/user/library');

                });
                console.log("A movie was found!");
            }

        })
        .catch(res1 => {
            //If anything weird happens redirect to library
            res.redirect('/user/library');
        });
}
// Mocvie Comment
exports.Comment = (req, res) => {
    const comment = req.body.comment;
    const movieid = req.body.movieid;

    //Set session
    if (!validator.isObjEmpty(req.session.user)) {
        //Set variable 
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.INSERT(`INSERT INTO Comments (UserId, MovieID, Comment) VALUE((SELECT UserID FROM Users WHERE EmailAddress = '${$Key}' OR IntraID = '${$Key}'), '${movieid}', '${comment}') `)
        .then(message => {
            res.send({
                status: 1,
                message: `Comment = ${comment} & MovieId = ${movieid}`
            });
        })
        .catch(message => {
            res.send({
                status: 0,
                message: `Comment = ${comment} & MovieId = ${movieid}`
            });
        });

}
//Movie Video
exports.Video = (req, res) => {

    const name = req.body.Name;

    fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${name}`, { method: 'GET' })
        .then(res => res.json()) // expecting a json response
        .then(json => {

            const movieID = json.data.movies[0].id;

            fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieID}&with_cast=true&with_images=true`, { method: 'GET' })
                .then(res => res.json()) // expecting a json response
                .then(json => {

                    const movieInfo = json.data.movie;

                    orm.SELECT(`SELECT us.FirstName, us.LastName, us.ProfilePicture, cm.Comment FROM Comments cm INNER JOIN Users us ON cm.UserId = us.UserID WHERE cm.MovieID = '${movieID}'`)
                        .then(res1 => {

                            const comments = res1;
                            console.log(comments);

                            //Default value
                            let hash = movieInfo.torrents[0].hash;
                            let encodedName = encodeURI(movieInfo.title);

                            //Create torrent magnet
                            const magnet = `magnet:?xt=urn:btih:${hash}&dn=${encodedName}&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce`;

                            return res.render('Storage/video', { title: AppName, appSection: name + " - Video", movie: movieInfo, Comments: comments, Magnet: magnet });

                        })
                        .catch(res1 => {

                            const comments = [{
                                FirstName: null,
                                LastName: null,
                                ProfilePicture: null,
                                Comment: null
                            }];
                            console.log(comments);

                            //Default value
                            let hash = movieInfo.torrents[0].hash;
                            let encodedName = encodeURI(movieInfo.title);

                            //Create torrent magnet
                            const magnet = `magnet:?xt=urn:btih:${hash}&dn=${encodedName}&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce`;

                            return res.render('Storage/video', { title: AppName, appSection: name + " - Video", movie: movieInfo, Comments: comments, Magnet: magnet });

                        });

                }).catch(message => {

                    return res.redirect("/user/library");
                })

        })
        .catch(message => {
            return res.redirect("/user/library");
        })



}
//Movie Search
exports.Library = (req, res) => {

    fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${req.body.Name}`, { method: 'GET' })
        .then(res => res.json()) // expecting a json response
        .then(json => {

            console.log("------------------------------------------------------");
            console.log(json.data.movie_count);
            console.log("------------------------------------------------------");

            if (json.data.movie_count == 0) {

                let resData = [];

                resData.push({
                    Name: "No data found!",
                    Vote: "No data found!",
                    Date: "No data found!",
                    Poster_Path: "/gifs/No Results Found.gif",
                    Background_Path: "/gifs/No Results Found.gif",
                    Overview: "No data found!"
                });

                res.render('Storage/library', { title: AppName, appSection: "Library", fromSearch: 1, movies: resData });
            } else {
                const movie1Results = json.data.movies;
                let moviesResults = [];

                //Loop to sort properly then push to array
                for (let i = 0; i < movie1Results.length; i++) {
                    moviesResults.push({
                        Name: movie1Results[i].title,
                        Vote: movie1Results[i].rating,
                        Date: movie1Results[i].year + "-01-06",
                        Poster_Path: movie1Results[i].large_cover_image,
                        Background_Path: movie1Results[i].background_image_original,
                        Overview: movie1Results[i].description_full
                    });
                }

                res.render('Storage/library', { title: AppName, appSection: "Library", fromSearch: 1, movies: moviesResults });

            }


        })
        .catch(message => {
            res.redirect("/user/library");
        })

}

//Save picture
exports.ProfileUserPicture = (req, res) => {
    const image = req.body.imageBase64;

    if (!image) {
        return res.redirect("/user/profile");
    }

    //Set session
    if (!validator.isObjEmpty(req.session.user)) {
        //Set variable 
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.SELECT(`SELECT EmailAddress FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
        .then(res1 => {

            const userEmail = res1[0].EmailAddress;

            //Call ORM to update
            orm.UPDATE(`UPDATE Users SET ProfilePicture = "${image}" WHERE EmailAddress = "${userEmail}"`)
                .then(resThen => {

                    console.log("Success Update _____________________________");

                    return res.send({
                        status: 1
                    })
                })
                .catch(resCatch => {
                    return res.redirect("/login");
                })
        })
        .catch(res1 => {
            //Redirect if there is an error
            return res.redirect('/');
        });
}
//Save passcode
exports.ProfileUserPasscode = (req, res) => {
    const passcode = req.body.Passcode;

    if (!passcode) {
        return res.redirect("/user/profile");
    }

    //Set session
    if (!validator.isObjEmpty(req.session.user)) {
        //Set variable 
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.SELECT(`SELECT EmailAddress FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
        .then(res1 => {

            const userEmail = res1[0].EmailAddress;

            //Generate Salt
            bcrypt.genSalt(10, (error, salt) => {
                //Generate Hash
                bcrypt.hash(passcode, salt, (error, hash) => {
                    //Call ORM to update
                    orm.UPDATE(`UPDATE Users SET Passcode = "${hash}" WHERE EmailAddress = "${userEmail}"`)
                        .then(resThen => {
                            return res.redirect("/user/profile");
                        })
                        .catch(resCatch => {
                            return res.redirect("/login");
                        })
                });
            });

        })
        .catch(res1 => {
            //Redirect if there is an error
            return res.redirect('/');
        });
}
//Save user data
exports.ProfileUserData = (req, res) => {
    const name = req.body.Name;
    const surname = req.body.Surname;
    const email = req.body.Email;
    const username = req.body.Username;

    if (!name || !surname || !email || !username) {
        return res.redirect("/user/profile");
    }

    //Set session
    if (!validator.isObjEmpty(req.session.user)) {
        //Set variable 
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.SELECT(`SELECT EmailAddress FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
        .then(res1 => {

            const userEmail = res1[0].EmailAddress;

            orm.UPDATE(`UPDATE Users SET FirstName = "${name}", LastName = "${surname}", EmailAddress = "${email}", Username = "${username}" WHERE EmailAddress = "${res1[0].EmailAddress}"`)
                .then(res1 => {

                    if (userEmail != email)
                        return res.redirect("/User/logout");
                    else
                        return res.redirect("/user/profile");

                })
                .catch(res1 => {
                    return res.redirect("/");
                });

        })
        .catch(res1 => {
            //Redirect if there is an error
            return res.redirect('/');
        });
}

exports.Logout = (req, res) => {
    //Delete user property
    if (!validator.isObjEmpty(req.session.user)) {
        delete req.session.user;
    }
    if (!validator.isObjEmpty(req.session.passport)) {
        delete req.session.passport;
    }
    //Redirect page
    return res.redirect("/login");
}