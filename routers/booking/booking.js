const express = require("express");
const asyncHandler = require("express-async-handler")
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config({ path: "../../.env" });
const moment = require("moment-timezone");
const router = express.Router();
const nodemailer = require("nodemailer");


const booking = require("../../models").Booking;
const ticket = require("../../models").Ticket;
const showtime = require("../../models").Showtime;
const user = require("../../models").User;
const theater = require("../../models").Theater;
const cinema = require("../../models").Cinema;
const movie = require("../../models").Movie;

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
    if(dateStart == "" || dateEnd == ""){
        res.status(404).json({
            status : "404",
            message : "Not enough information",
        });
    }
    const startedDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    
   // [Sequelize.literal("COUNT(DISTINCT(product))"), "countOfProducts"]
  // [[sequelize.fn('COALESCE', sequelize.fn('SUM', (mysql.col('col_name'), mysql.col('col_2_name'))), (some other code here ...)),'alias']]
   //[sequelize.fn("SUM", sequelize.col("theater.showtime.bookings.totalprice")), "total"]
    var listBookings = await cinema.findAll( { 
        attributes:["id","name","address",
                    [sequelize.fn("SUM", sequelize.col("theater.showtime.bookings.tickets.price")), "total"],
                    [sequelize.fn("COUNT", sequelize.col("theater.showtime.bookings.tickets.id")), "count"]],
        include: [
            {
                model: theater, as: "theater",
                attributes: [],
                include: [ {
                    model: showtime, as :"showtime",
                    attributes: [],
                    include: [{
                        model: booking, as: "bookings",
                        attributes: [],
                        where: {
                            paid: true,
                            bookingtime :{[Op.between] : [startedDate , endDate ]}
                        },
                        include:[{
                            model: ticket,as: "tickets",
                            attributes: []
                        }]
                    }],
                }]
            }
        ],
        group: ["Cinema.id"],
        order: sequelize.literal('total DESC')
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
    if(dateStart == "" || dateEnd == ""){
        res.status(404).json({
            status : "404",
            message : "Not enough information",
        });
    }
    const startedDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    //[sequelize.fn("SUM", sequelize.col("tickets.price")), "total"],
    var listMovies = await movie.findAll( { 
        attributes:["id","name","view",[sequelize.fn("SUM", sequelize.col("showtime.bookings.tickets.price")), "total"],[sequelize.fn("COUNT", sequelize.col("showtime.bookings.tickets.id")), "count"]],
        include: [
            {
                model: showtime, as: "showtime",
                attributes: [],
                include: [{
                    model: booking, as : "bookings",
                    attributes: [],
                    where:{
                        paid: true,
                        bookingtime :{[Op.between] : [startedDate , endDate ]}
                    },
                    include: [{
                        model: ticket, as: "tickets",
                       attributes: []
                    }]
                }],
            },
        ],
        group: ["Movie.id"],
        order: sequelize.literal('total DESC')
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
router.get("/show/:user",asyncHandler( async (req, res) => {
    console.log(req.query)
    var listBookings = await booking.findAll( { 
        where: {
            paid: false,
            user_id: req.params.user
        },
        attributes: ["id"],
        include:
            [
                {
                model: ticket, as: "tickets",
                attributes: ["id","chair_id","price"],
                },
                {
                model: showtime, as: "showtime",
                attributes: ["id"],
                include: [{
                    model: theater,as : "theater",
                    attributes: ["id"],
                    include: [
                        {
                            model: cinema, as: "cinema",
                            attributes: ["name","address"]
                        }
                    ]
                },
                {
                    model: movie, as: "movie",
                    attributes: ["id", "name","minute_time"]
                }
        ]
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
    if( location_Seat == "null" || list_Seat == "null" || user_id == "" || showtime_id == "" ) {
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
const buy = async(list,user_id) => {
    let temp ;
    const date_time = new Date();
    const User = await user.findById(user_id);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });

    transporter.use("compile", hbs({
        viewEngine: {
            extName:".hbs", /* or ".handlebars" */
            viewPath:__dirname +"/view/",
            layoutsDir:__dirname +"/view/",
            defaultLayout:"ticket"
        },
        viewPath: __dirname+ "/view/"
    }));
    
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        var listBookings = await booking.findAll( { 
            where: {
                paid: false,
                user_id: user_id,
                id: id
            },
            attributes: ["id"],
            include:
                [
                    {
                    model: ticket, as: "tickets",
                    attributes: ["id","chair_id","price"],
                    },
                    {
                    model: showtime, as: "showtime",
                    attributes: ["id","start_time"],
                    include: [{
                        model: theater,as : "theater",
                        attributes: ["id"],
                        include: [
                            {
                                model: cinema, as: "cinema",
                                attributes: ["name","address"]
                            }
                        ]
                    },
                    {
                        model: movie, as: "movie",
                        attributes: ["id", "name","minute_time"]
                    }
            ]
                    }
                ],
        });
        let listTicket =  listBookings[i].dataValues.tickets;
        let nameCinema = listBookings[i].dataValues.showtime.theater.cinema.name;
        let addressCinema = listBookings[i].dataValues.showtime.theater.cinema.address;
        let nameMovie = listBookings[i].dataValues.showtime.movie.name;
        let minute_time = listBookings[i].dataValues.showtime.movie.minute_time;
        let start_time = listBookings[i].dataValues.showtime.start_time;
        let timestart  = moment(Date(start_time)).format("HH:mm");
        let date = moment(Date(start_time)).format("YYYY-MM-DD");

        for (let index = 0; index < listTicket.length; index++) {
            let email = User.dataValues.email;
            let data = {
                cinema: nameCinema,
                address: addressCinema,
                name:nameMovie,
                time: minute_time,
                seat: listTicket[index].dataValues.chair_id,
                timestart: timestart,
                price: listTicket[index].dataValues.price,
                date: date
            }
            await transporter.sendMail({
                from: "CCG Cinema ✔ <buingocyen055@gmail.com>",
                to: email,
                subject: "CCG Cinema Ticket",
                text: "Thank you!",
                template: "ticket",
                context: data
        });

        }
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
    const { listId,user_id }  = req.body;

    if( listId == [] ) {
        res.status(400).json({
            status : "400",
            message : "Not enough information"
        });
    }
    const updateBooking = buy(listId,user_id);
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