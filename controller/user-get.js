const AppName = "Hypertube";
const validator = require('../assets/validators');
const orm = require('../model/orm-model');
const fetch = require('node-fetch');
const envTheMovieDb = require('../envTheMovieDB');;
//Controller method for /encounter page
exports.Encounter = (req, res) => {
    res.render('encounter', { title: 'Matcha' });
}
//Controller method for /visitors page
exports.Visitors = (req, res) => {
    res.render('visitors', { title: 'Matcha' });
}
//Controller method for /likes page
exports.Likes = (req, res) => {
    res.render('likes', { title: 'Matcha' });
}
//Controller method for /settings page
exports.Settings = (req, res) => {
    res.render('settings', { title: 'Matcha' });
}

//Controller method for /nearby page
exports.Library = (req, res) => {

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
                                Date: movie1Results[i].date_uploaded,
                                Poster_Path: movie1Results[i].large_cover_image,
                                Background_Path: movie1Results[i].background_image_original,
                                Overview: movie1Results[i].description_full
                            });
                    }

                    res.render('Storage/library', { title: AppName, appSection: "Library", fromSearch: 0, movies: moviesResults });
                })
                .catch(message => {
                    console.log(message);
                    return ;
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
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)) {
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
        .then(res1 => {
            const userInfo = {
                Name: res1[0].FirstName,
                Surname: res1[0].LastName,
                Email: res1[0].EmailAddress,
                Username: res1[0].Username,
                ProfilePicture: (res1[0].ProfilePicture || res1[0].ProfilePicture.length > 5 ? res1[0].ProfilePicture : "/images/profile.svg")
            };
            //res.send($Key);
            res.render('Storage/profile', { title: AppName, appSection: "Profile", information: userInfo });
        })
        .catch(res1 => {
            //Redirect if there is an error
            res.redirect('/login');
        });

}
//Controller method for /preference page
exports.Preference = (req, res) => {
    res.render('preference', { title: 'Matcha' });
}
//Controller method for /messages page
exports.Messages = (req, res) => {
    res.render('messages', { title: 'Matcha' });
}
//Controller method for /matched page
exports.Matched = (req, res) => {
    res.render('matched', { title: 'Matcha' });
}