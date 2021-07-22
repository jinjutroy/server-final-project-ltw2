const express = require('express');
const asyncHandler = require('express-async-handler')
var sequelize = require('sequelize');
const { Op } = require('sequelize');
const router = express.Router();
const booking = require('../../models').Booking;
const ticket = require('../../models').Ticket;
const showtime = require('../../models').Showtime;
const user = require('../../models').User;
const theater = require('../../models').Theater;
const cinema = require('../../models').Cinema;
const movie = require('../../models').Movie;


router.get("/",asyncHandler( async (req, res) => {
    var listBookings = await booking.findAll();
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listBookings || []
    });
}));
router.post("/cinema",asyncHandler( async (req, res) => {
    const {dateStart, dateEnd} = req.body;
    if(dateStart == '' || dateEnd == ''){
        res.status(404).json({
            status : "404",
            message : "Not enough information",
        });
    }
    const startedDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
   // [Sequelize.literal('COUNT(DISTINCT(product))'), 'countOfProducts']

    // SELECT b.id,COUNT(b.id),ci.name,s.price,SUM(t.price) as total FROM "Bookings" as b 
    // JOIN "Showtimes" as s ON b.showtime_id = s.id 
    // JOIN "Tickets" as t ON  b.id=t.booking_id
    // JOIN "Theaters" as th ON th.id = s.theater_id 
    // JOIN "Cinemas" as ci on ci.id = th.cinema_id 
    // GROUP BY (ci.id,ci.name,b.id,s.price)
    // ORDER BY total DESC
    var listBookings = await booking.findAll( { 
        where: {
            paid: true,
            bookingtime :{[Op.between] : [startedDate , endDate ]}
        },
        attributes:[[sequelize.fn('SUM', sequelize.col('tickets.price')), 'total'],[sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count']],
        include: [
            {
                model: showtime, as: "showtime",
                include: [ {
                    model: theater, as :"theater",
                    attributes: ["cinema_id"],
                    include: [{
                        model: cinema, as: "cinema",
                        attributes: ["id","name","address"]
                    }],
                }],
                attributes: ["theater_id"],
            },{
                model: ticket, as: "tickets",
                attributes: []
            }
        ],
        group: ["showtime->theater->cinema.id","Booking.id","showtime.id","showtime->theater.id","tickets.price"],
        order: [
            [sequelize.fn('SUM', sequelize.col('tickets.price')), 'DESC'],
        ],
    });
    res.status(200).send({
        status : "200",
        message : "Success",
        data: listBookings
    });
}));

// SELECT m.id,m.name, SUM(t.price)as total 
// FROM "Movies" as m 
// JOIN "Showtimes" as s ON s.movie_id = m.id 
// JOIN "Bookings" as b ON b.showtime_id = s.id 
// JOIN "Tickets" as t ON t.booking_id = b.id 
// GROUP BY m.id 
// ORDER BY total DESC
router.post("/movie",asyncHandler( async (req, res) => {
    const {dateStart, dateEnd} = req.body;
    if(dateStart == '' || dateEnd == ''){
        res.status(404).json({
            status : "404",
            message : "Not enough information",
        });
    }
    const startedDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    //[sequelize.fn('SUM', sequelize.col('tickets.price')), 'total'],
    var listMovies = await booking.findAll( { 
        where: {
            paid: true,
            bookingtime :{[Op.between] : [startedDate , endDate ]}
        },
        attributes:["id",[sequelize.fn('SUM', sequelize.col('tickets.price')), 'total'],[sequelize.fn('COUNT', sequelize.col('tickets.id')), 'count']],
        include: [
            {
                model: showtime, as: "showtime",
                attributes: ['movie_id'],
                include: [{
                    model: movie, as : 'movie',
                    attributes: ["id",'name',"view"]
                }],
            },{
                model: ticket, as: "tickets",
                attributes: []
            }
        ],
        group: ["showtime->movie.id","showtime->movie.view" ,"showtime.id","Booking.id"],
        order: [
            [sequelize.fn('SUM', sequelize.col('tickets.price')), 'DESC'],
        ],
    });
    res.status(200).json({
        status : "200",
        message : "Success",
        data: listMovies || []
    });
}));
router.get("/chair",asyncHandler( async (req, res) => {
    var listBookings = await booking.findAll( { 
        where: {
            paid: true
        },
        attributes: ["id"]
        ,
        include:
            [
                {
                model: ticket, as: "tickets",
                attributes: ["chair_id","address_x","address_y"],
                },
                {
                model: showtime, as: "showtime",
                attributes: ["id", "movie_id"],
                where: {
                    movie_id: req.query.movie}
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
    const { list_Seat,location_Seat,user_id,showtime_id }  = req.body;
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