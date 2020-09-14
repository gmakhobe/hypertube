const validator = require("../assets/validators");
const orm = require("../model/orm-model");
const bcrypt = require('bcryptjs');
const AppName = "Hypertube";
const fetch = require('node-fetch');
const envTheMovieDb = require('../envTheMovieDB');

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

                    return res.render('Storage/video', { title: AppName, appSection: name + " - Video", movie: movieInfo });

                }).catch(message => {
                    res.redirect("/user/library");
                })

        })
        .catch(message => {
            res.redirect("/user/library");
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