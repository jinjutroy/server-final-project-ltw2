const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const cinema = require('../../models').Cinema;


router.get("/",asyncHandler( async (req, res) => {
    var listCinema = await cinema.findAll();
    res.status(200).json({
        status : "200",
        message : "ok",
        data: listCinema || []
    });
}));
router.get("/:id",asyncHandler( async (req, res) => {
    var Cinema = await cinema.findById(req.params.id);
    if( !Cinema) {
        res.status(404).json({
            status : "404",
            message : "Cinema not found",
            data: Cinema
        });    
    }
    res.status(200).json({
        status : "200",
        message : "ok",
        data: Cinema
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const { name, address }  = req.body;
    const typeTheater = ['2d', '3d', '4dx'];
    if( name == "" || address == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const newCinema = await cinema.create({
        name: name,
        address: address
    });
    if( !newCinema) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    res.status(200).json({
        status : "200",
        message : "OK",
        id: newCinema.id
    });
}));

module.exports = router;