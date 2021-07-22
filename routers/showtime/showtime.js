const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const showtime = require('../../models').Showtime;
const theater = require('../../models').Theater;
const movie = require('../../models').Movie;


router.get("/",asyncHandler( async (req, res) => {
    var listShowtimes= await showtime.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listShowtimes || []
    });
}));
router.get("/movie",asyncHandler( async (req, res) => {
    var Showtime = await showtime.findAll({
        where:{
               movie_id : req.query.movie,
               theater_id : req.query.theater
        },
        include: [{
            model: theater, as: "theater",
        }]
    });
    if( !Showtime) {
        res.status(404).json({
            status : "404",
            message : "Showtime not found",
            data: Showtime || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: Showtime
    });
}));
router.get("/:id",asyncHandler( async (req, res) => {
    var Showtime = await showtime.findById(req.params.id);
    if( !Showtime) {
        res.status(404).json({
            status : "404",
            message : "Showtime not found",
            data: Showtime || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: Showtime
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const {movie_id,theater_id,start_time,end_time,price}  = req.body;
    if( movie_id == '' || theater_id == '' || start_time == "" || end_time == "" || price == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const foundMovie = await movie.findById(movie_id);
    if( !foundMovie) {
        res.status(400).json({
            status : "400",
            message : "Can not find the movie"
        });
    }
    const foundTheater =await theater.findById(theater_id);
    if( !foundTheater) {
        res.status(400).json({
            status : "400",
            message : "Can not find the theater"
        });
    }
    const newShowtime = await showtime.create({
        movie_id: movie_id,
        theater_id: theater_id,
        start_time: start_time,
        end_time: end_time,
        price: price
    });
    if( !newShowtime) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
   
    res.status(200).json({
        status : "200",
        message : "OK",
       id: newShowtime.id
    });
}));

module.exports = router;