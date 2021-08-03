const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();
const movie = require('../../models').Movie;
const showtime = require('../../models').Showtime;
const theater = require('../../models').Theater;
var sequelize = require('sequelize');


router.get("/",asyncHandler( async (req, res) => {
    var listMovies = await movie.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listMovies || []
    });
}));
router.get("/foundTheater/:id",asyncHandler( async (req, res) => {
    var Movie = await showtime.findAll({
     attributes: ["theater_id"],
     include: [{
         model: theater, as: "theater",
         attributes: ["id","name"],
     },
     {
        model: movie, as: "movie",
        attributes: [],
        where:{
           id : req.params.id
       },
    }],  
        
     group: ["theater_id","theater.id" ]
    });
    if( !Movie) {
        res.status(404).json({
            status : "404",
            message : "Movie not found",
            data: Movie || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: Movie
    });
}));
router.get("/:id",asyncHandler( async (req, res) => {
    const id = req.params.id;
    if( id == '' ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const foundMovie = await movie.findById(id);
    if(!foundMovie){
        res.status(404).json({
            status : "404",
            message : "Movie not found",
            data: foundMovie || []
        });
    }
    const updateMovie = await movie.update({ view: foundMovie.view + 1 }, {
        where: {
          id: id
        }})
    if( !updateMovie) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success"
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const { name , image , trailer, introduce, opening_day, minute_time}  = req.body;

    const open = new Date(opening_day);
    if( name == '' || image == '' || introduce == "" || minute_time == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    console.log("🚀 ~ file: movie.js ~ line 81 ~ router.post ~ name , image , trailer, introduce, opening_day, minute_time", name , trailer, introduce, opening_day, minute_time)

    const newMovie = await movie.create({
        name: name,
        image: image,
        trailer: trailer,
        introduce: introduce,
        opening_day:open,
        minute_time:minute_time,
        view:0
    });
    if( !newMovie) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        id: newMovie.id
    });
}));
module.exports = router;