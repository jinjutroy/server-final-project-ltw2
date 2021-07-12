const asyncHandler = require('express-async-handler')
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../.env' });

const User = require('../../models').User;
router.post('/', asyncHandler(async function (request, response) {
    let { email} = request.body;
    let token = randomstring.generate(7);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    await transporter.sendMail({
        from: 'CCG Cinema<buingocyen055@gmail.com>',
        to: email,
        subject: "Sign up Account",
        html: `Account verification code: <b><h2>${token}</h2></b><br> You have to take one more step before you can create an account to log in! `
    });

    // Create a new user
    const found = await User.findByEmail(email);
    if (found) {
        await User.update({ token: token }, {
            where: {
                email: email
            }
        })
        return response.status(200).send({ Status: 'Complete' });
    }
    else {
        return response.status(400).send({ Status: 'Do not exist' });
    }
}))

module.exports = router;