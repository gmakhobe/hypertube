const AppName = "Hypertube";
const validator = require('../assets/validators');
const orm = require('../model/orm-model');
const fetch = require('node-fetch');
const envTheMovieDb = require('../envTheMovieDB');

//Controller method for /settings page
exports.UserInfoInit = (req, res) => {
    res.render('Storage/InitMail', { title: 'Matcha', appSection: "Set User Info" });
}

//Controller method for /nearby page
exports.Library = (req, res) => {

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

    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${envTheMovieDb}`, { method: 'GET' })
        .then(res => res.json()) // expecting a json response
        .then(json => {

            const movieResultsRaw = json.results;
            let moviesResults = [];
            //Loop to sort properly then push to array
            for (let i = 0; i < movieResultsRaw.length; i++) {
                if (movieResultsRaw[i].original_title) {
                    moviesResults.push({
                        Name: movieResultsRaw[i].original_title,
                        Vote: movieResultsRaw[i].vote_average,
                        Date: movieResultsRaw[i].release_date,
                        Poster_Path: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movieResultsRaw[i].poster_path,
                        Background_Path: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + movieResultsRaw[i].backdrop_path,
                        Overview: movieResultsRaw[i].overview
                    });
                }
            }

            fetch(`https://yts.mx/api/v2/list_movies.json?limit=15`, { method: 'GET' })
                .then(res => res.json()) // expecting a json response
                .then(json => {

                    const movie1Results = json.data.movies;

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

                    orm.SELECT(`SELECT m.MovieId, m.MovieName, m.MovieURL, m.DateViews FROM MyMovies mm INNER JOIN Movies m ON mm.MovieId = m.MovieId WHERE mm.UserId = (SELECT UserID FROM Users WHERE EmailAddress = '${$Key}' OR IntraID = '${$Key}')`)
                        .then(data1 => {

                            let seenMoviesArr = [];

                            for (let index = 0; index < data1.length; index++){
                                //Copy every index to a new array
                                seenMoviesArr.push(data1[index]);

                            }

                            console.log(seenMoviesArr);

                            res.render('Storage/library', { title: AppName, appSection: "Library", fromSearch: 0, movies: moviesResults, SeenMovies: seenMoviesArr });
                           
                        })

                })
                .catch(message => {
                    console.log(message);
                    return;
                })


        });


    /*

    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${envTheMovieDb}`, { method: 'GET'})
    .then(res => res.json()) // expecting a json response
    .then(json => {

        const movie1Results = json.results;

        res.render('Storage/library', { title: AppName, appSection: "Library", fromSearch: 0, movies: results });
    })

    */

}

//Controller method for /profile page
exports.Profile = (req, res) => {
    //Set session
    if (!validator.isObjEmpty(req.session.user)) {
        //Set variable 
        $Key = validator.aq_formatter(req.session.user.id);
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = validator.aq_formatter(req.session.passport.user.id);
    }

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
        .then(res1 => {
            const userInfo = {
                Name: validator.aq_formatter_rev(res1[0].FirstName),
                Surname: validator.aq_formatter_rev(res1[0].LastName),
                Email: validator.aq_formatter_rev(res1[0].EmailAddress),
                Username: validator.aq_formatter_rev(res1[0].Username),
                ProfilePicture: (res1[0].ProfilePicture || res1[0].ProfilePicture != null ? res1[0].ProfilePicture : "/images/profile.svg")
            };
            //res.send($Key);
            res.render('Storage/profile', { title: AppName, appSection: "Profile", information: userInfo });
        })
        .catch(res1 => {
            //Redirect if there is an error
            console.log("Error");
            console.log(res1);
            res.redirect('/login');
        });

}
