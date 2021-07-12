const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();

const Movie = require('../../models').Movie;
const Theater = require('../../models').Theater;
const Showtime = require('../../models').Showtime;
const Cinema = require('../../models').Cinema;
const User = require('../../models').User;
router.post('/',asyncHandler(async function(request, response){
    const movie = await Movie.findAll({
      opening_day: [
        ['view', 'DESC'],
    ],
    });
    const theater = await Theater.findAll();
    const showtime = await Showtime.findAll();
    const cinema = await Cinema.findAll();
    if(movie && theater){
        return response.status(200).send( { Status: 'Complete',
                                            movie: movie, theater: theater,showtime: showtime,cinema:cinema});
    }else{
      return response.status(400).send({ Status:'Error.'});
    }
     
  }));
  router.post('/user',asyncHandler(async function(request, response){
    const user = await User.findAll({
      attributes: ['id','email','numphone','role','active','fullname']
    });
    if(user){
        return response.status(200).send( { Status: 'Complete',
                                            user: user});
    }else{
      return response.status(400).send({ Status:'Error.'});
    }
     
  }));
module.exports = router;