const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const cinema = require('../../models').Cinema;


router.get("/",asyncHandler( async (req, res) => {
    let listCinema = await cinema.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listCinema || []
    });
}));

router.get("/:id",asyncHandler( async (req, res) => {
    let Cinema = await cinema.findById(req.params.id);
    if(!Cinema) {
        res.status(404).json({
            status : "404",
            message : "Cinema not found",
            data: Cinema|| []
        });    
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: Cinema
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const { name, address }  = req.body;
    if( name == "" || address == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const findCinema = await cinema.findOne({where: {name:name}});
    if(findCinema && name == findCinema.name || findCinema &&  address == findCinema.address ) {
        res.status(400).json({
            status : "400",
            message : "Duplicate information"
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
        message : "Success",
        id: newCinema.id
    });
}));

module.exports = router;