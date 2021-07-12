const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const express =  require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../../models').User;

router.post('/', asyncHandler(async function (req, res) {
  const {token,email} = req.body;
  if(token){
    const user = await User.findOne({where: {email: email}});
    if(user){
      if(token === user.token){
        await User.update({ token:"",active: true }, {
          where: {
            email: email
          }})
        return res.status(200).send({ Status: 'Complete' });
      }else{
        return res.status(400).send({ Status: 'Invalid' });
      }
    }else return res.status(400).send({ Status: 'Invalid' });
  }
       
  

}));

module.exports = router;
