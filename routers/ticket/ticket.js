const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const booking = require('../../models').Booking;
const ticket = require('../../models').Ticket;
const movie = require('../../models').Movie;


router.get("/",asyncHandler( async (req, res) => {
    var listTickets = await  ticket.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listTickets || []
    });
}));

router.get("/:id",asyncHandler( async (req, res) => {
    var Ticket = await ticket.findById(req.params.id);
    if( !Ticket) {
        res.status(404).json({
            status : "404",
            message : "Ticket not found",
            data: Ticket || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: Ticket
    });
}));

module.exports = router;