const express = require('express');
const asyncHandler = require('express-async-handler')

const router = express.Router();
const booking = require('../../models').Booking;
const ticket = require('../../models').Ticket;
const showtime = require('../../models').Showtime;
const user = require('../../models').User;
const theater = require('../../models').Theater;


router.get("/",asyncHandler( async (req, res) => {
    var listBookings = await booking.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listBookings || []
    });
}));
const date  = new Date();
router.get("/:user",asyncHandler( async (req, res) => {
    var listBookings = await booking.findAll( { 
        where: {
            user_id:req.params.user,
            paid: false
        },
        include:
            [
                {
                model: ticket, as: "tickets",
                attributes: ["chair_id","price"]
                },
                {
                model: showtime, as: "showtime",
                attributes: ["id", "movie_id","theater_id"]
                }
            ],
    });
    if( !listBookings) {
        res.status(404).json({
            status : "404",
            message : "Booking not found",
            data: listBookings || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listBookings
    });
}));
router.get("/history/:user",asyncHandler( async (req, res) => {
    var listBookings = await booking.findAll( { 
        where: {
            user_id:req.params.user,
            paid: true
        },
        include:
            [
                {
                model: ticket, as: "tickets",
                attributes: ["chair_id","price"],
                },
                {
                model: showtime, as: "showtime",
                attributes: ["id", "movie_id","theater_id"],
                include: [{model: theater, as: "theater"}]
                }
            ],
    });
    if( !listBookings) {
        res.status(404).json({
            status : "404",
            message : "Booking not found",
            data: listBookings || []
        });
    }
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listBookings
    });
}));
router.post("/",asyncHandler( async (req, res) => {
    const { list_Seat,location_Seat,user_id,showtime_id,bookingtime }  = req.body;
    if( location_Seat == 'null' || list_Seat == 'null' || user_id == "" || showtime_id == "" ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const foundUser = await user.findById(user_id);
    if( !foundUser) {
        res.status(400).json({
            status : "400",
            message : "Can not find the user"
        });
    }
    const foundShowtime =await showtime.findById(showtime_id);
    if( !foundShowtime) {
        res.status(400).json({
            status : "400",
            message : "Can not find the showtime"
        });
    }
    let totalprice = foundShowtime.price*list_Seat.length;
    const newBooking = await booking.create({
        user_id: user_id,
        showtime_id: showtime_id,
        totalprice: totalprice
    });
    if( !newBooking) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    if(newBooking){
        for(let i=0; i < list_Seat.length; i++) {
                await ticket.create({
                booking_id: newBooking.id,
                chair_id: list_Seat[i],
                address_x: location_Seat[list_Seat[i]][0],
                address_y: location_Seat[list_Seat[i]][1],
                price: foundShowtime.price
            });
        }
    }
   
    res.status(200).json({
        status : "200",
        message : "OK",
        id: newBooking.id
    });
}));
const buy = async(list) => {
    let temp ;
    const date_time = new Date();
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp = await booking.update({
            paid: true,
            bookingtime: date_time ,
        },{
            where: {id: id}
        });
    }
    return temp;
}
router.post("/buy",asyncHandler( async (req, res) => {
    const { listId }  = req.body;
    if( listId == [] ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const updateBooking = buy(listId);
    if( !updateBooking) {
        res.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    res.status(200).json({
        status : "200",
        message : "OK",
        id: updateBooking
    });
}));
module.exports = router;