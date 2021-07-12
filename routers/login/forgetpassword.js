const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const express = require('express');
const randomstring = require("randomstring");
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config({ path: '../../.env' });

const User = require('../../models').User;

router.post('/', asyncHandler(async function (req, res) {
    const { email } = req.body;
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
        from: 'CCG Cinema <buingocyen055@gmail.com>',
        to: email,
        subject: "Forget password CCG Cinema",
        html: `Account verification code: <b><h2>${token}</h2></b><br>You have to take one more step before you can change password!  `
    });

    if (token) {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log(user);
            await User.update({ token: token }, {
                where: {
                    email: email
                }
            })
            return res.status(200).send({ Status: 'Complete' });
        } else {
            return res.status(400).send({ Status: 'Don\'t exist' });
        }
    }
}));
router.post('/resetpassword', asyncHandler(async function (req, res) {
    const {password,email} = req.body;
    if(password){
      const user = await User.findOne({where: {email: email}});
      if(user){
          await User.update({ password: bcrypt.hashSync(password, 10) }, {
            where: {
              email: email
            }})
          return res.status(200).send({ Status: 'Complete' });
      }else return res.status(400).send({ Status: 'Invalid' });
    }
  
  }));
module.exports = router;
