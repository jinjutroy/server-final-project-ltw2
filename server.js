require('dotenv').config({ path: './.env' });
const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');


const db = require('./models');
var app = express();
const DOMAIN_URL = process.env.DOMAIN_URL;
const PORT = process.env.PORT; 

//app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


//routers
const loginRoute = require('./routers/login/login');
const registerRoute = require('./routers/register/register');
const confirmRoute = require('./routers/register/confirm');
const forgetpassRoute = require('./routers/login/forgetpassword');
const activeRoute = require('./routers/login/active');
const dataRoute = require('./routers/load/load-data');
const deleteShowtimeRoute = require('./routers/delete/showtime');
const deleteCinemaRoute = require('./routers/delete/cinema');
const deleteTheaterRoute = require('./routers/delete/theater');
const deleteMovieRoute = require('./routers/delete/movie');
const deleteUserRoute = require('./routers/delete/user');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app use
app.use('/api/login',loginRoute);
app.use('/api/register',registerRoute);
app.use('/api/confirm',confirmRoute);
app.use('/api/forgetpassword',forgetpassRoute);
app.use('/api/active',activeRoute);
app.use('/load/data',dataRoute);
app.use('/delete/showtime',deleteShowtimeRoute);
app.use('/delete/cinema',deleteCinemaRoute);
app.use('/delete/theater',deleteTheaterRoute);
app.use('/delete/movie',deleteMovieRoute);
app.use('/delete/user',deleteUserRoute);



db.sequelize.sync().then(function() {
  app.listen( PORT, () => {
    console.log(`Server is listening on ${DOMAIN_URL}${PORT}`);
  });
}).catch(console.error);