const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const movie = require('../../models').Movie;


router.get("/",asyncHandler( async (req, res) => {
    var listMovies = await movie.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listMovies || []
    });
}));
router.get("/:id",asyncHandler( async (req, res) => {
    var Movie = await movie.findById(req.params.id);
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
router.post("/",asyncHandler( async (req, res) => {
    const { name , image , trailer, introduce, opening_day, minute_time}  = req.body;
    console.log(req.body)
    if( name == '' || image == '' || introduce == "" || opening_day == null || minute_time == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const newMovie = await movie.create({
        name: name,
        image: image,
        trailer: trailer,
        introduce: introduce,
        opening_day:opening_day,
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
        message : "OK",
        id: newMovie.id
    });
}));
router.post("/:id",asyncHandler( async (req, res) => {
    const { view }  = req.body;
    if( view == '' ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const foundMovie = await movie.findById(req.params.id);
    if(!foundMovie){
        res.status(404).json({
            status : "404",
            message : "Movie not found",
            data: foundMovie || []
        });
    }
    const updateMovie = await movie.update({ view: view }, {
        where: {
          id: req.params.id
        }})
    if( !updateMovie) {
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