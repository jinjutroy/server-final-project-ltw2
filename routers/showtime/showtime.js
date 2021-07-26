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
    console.log("🚀 ~ file: showtime.js ~ line 58 ~ router.post ~ req.body", req.body)
    const timeStart =new Date(start_time).getTime();
    const timeEnd = new Date(end_time).getTime();
    if( movie_id == '' || theater_id == '' || start_time == "" || end_time == "" || price == ""  ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    if( timeStart> timeEnd||timeEnd-timeStart  === 0) {
        res.status(400).json({
            status : "400",
            message : "Time wrong !!"
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
    let parsePrice = parseInt(price);
    let stime = new Date(start_time);
    let etime = new Date(end_time);
    console.log("🚀 ~ file: showtime.js ~ line 90 ~ router.post ~ etime", new Date())
    const newShowtime = await showtime.create({
        movie_id: movie_id,
        theater_id: theater_id,
        start_time: stime,
        end_time: etime,
        price: parsePrice,
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