const asyncHandler = require('express-async-handler')
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../.env' });
const { transporter } = require('../../utils/utils');

const User = require('../../models').User;
router.post('/', asyncHandler(async function (request, response) {
    let { fullname, phone, gender, email, password } = request.body;
    let token = randomstring.generate(7);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
        await transporter.sendMail({
        from: 'CCG Cinema ✔ <buingocyen055@gmail.com>',
        to: email,
        subject: "Sign up Account",
        html: `Account verification code: <b><h2>${token}</h2></b><br> You have to take one more step before you can create an account to log in! `
    });

     // Create a new user
    const found = await User.findByEmail(email);
    if (found) {
        return response.status(400).send({ Status: 'Email is exist' });
    }
    else {
        const user = await User.create({
            fullname: fullname, 
            numphone: phone, 
            gender: gender,
            email: email,
            password: bcrypt.hashSync(password, 10),
            role: "user",
            token: token,
            active: false
        });
        //console.log(bcrypt.hashSync('123456',10));
        if (user) {
            return response.status(200).send({ Status: 'Complete' });
        }
    }
}))

module.exports = router;