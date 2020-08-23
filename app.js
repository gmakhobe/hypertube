const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routesIndex = require("./routes/index");
const routesUser = require("./routes/users");
const routesApi = require("./routes/api");
const dbcon = require("./model/orm-model");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const env = require('./env42');
const logOrInsert = require('./model/LogOrInsert');
const app = express();
const port = 5001;

//Configure strategy
passport.use(new FortyTwoStrategy({
  clientID: env.clientID,
  clientSecret: env.clientSecret,
  callbackURL: `http://localhost:${port}/api/login/42/callback`,
  profileFields: {
    'id': function (obj) { return String(obj.id); },
    'username': 'login',
    'name.familyName': 'last_name',
    'name.givenName': 'first_name',
    'emails.0.value': 'email'
  }
},function (accessToken, refreshToken, profile, cb) {
    logOrInsert( {
      id: profile.id,
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
      username: profile._json.login,
      email: profile._json.email
    }, cb);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'wMnGuvBetLR27y48Y5y36fN8NM49Vp',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use(routesIndex);
app.use(routesUser);
app.use(routesApi);


//Serve
app.listen(port, () =>
  console.log(`Go to http://localhost:${port} on your browser`)
);

dbcon.StartConnection()
  .then(message => console.log(message))
  .catch(message => console.log(message))
