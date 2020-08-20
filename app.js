const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routesIndex = require("./routes/index");
const routesUser = require("./routes/users");
const dbcon = require("./model/orm-model");

const app = express();
const port = 5001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use(routesIndex);
app.use(routesUser);
//Serve
app.listen(port, () => 
  console.log(`Go to http://localhost:${port} on your browser`)
);

dbcon.StartConnection()
.then(message => console.log(message))
.catch(message => console.log(message))