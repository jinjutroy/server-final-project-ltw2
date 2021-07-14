const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const theater = require('../../models').Theater;
const cinema = require('../../models').Cinema;


router.get("/",asyncHandler( async (req, res) => {
    var listTheater = await theater.findAll();
    res.status(200).json({
        status : "200",
        message : "ok",
        data: listTheater || []
    });
}));
router.get("/:id",asyncHandler( async (req, res) => {
    var Theater = await theater.findById(req.params.id);
    if( !Theater) {
        res.status(404).json({
            status : "404",
            message : "Theater not found",
            data: Theater
        });    
    }
    res.status(200).json({
        status : "200",
        message : "ok",
        data: Theater
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const { name, cinema_id, type,  number_row, number_column }  = req.body;
    const typeTheater = ['2d', '3d', '4dx'];
    if( name == "" || cinema_id == "" || type == "" || number_row == "" || number_column == "") {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const foundCinema = await cinema.findById(cinema_id);
    if( !foundCinema) {
        res.status(400).json({
            status : "400",
            message : "Can not find the cinema"
        });
    }
    if( Number(number_row) <= 0 || Number(number_column) <= 0) {
        res.status(400).json({
            status : "400",
            message : "Number Row and Number Column must be greater than 0"
        });
    }
    if( !typeTheater.includes(type)) {
        res.status(400).json({
            status: "400",
            message : "Type is : '2d', '3d', '4dx'"
        });
    }
    const newTheater = await theater.create({
        name: name,
        cinema_id: cinema_id,
        type: type,
        number_row: number_row,
        number_column: number_column
    });
    if( !newTheater) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    res.status(200).json({
        status : "200",
        message : "OK",
        id: newTheater.id
    });
}));

module.exports = router;