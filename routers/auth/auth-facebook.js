const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../models').User;


router.post('/', asyncHandler(async function (request, response) {
    const { userID,name, email} = request.body;
    const facebook_user = await user.findByFacebookId(facebookId)
    if(facebook_user){
        if(facebook_user.role === 'lock'){
            return response.status(200).json({
                message: " Facebook User ís lock",
                data: []
            })
        }
        return response.status(200).json({
            message: "Find Facebook User",
            data: facebook_user||[]
        })
    }
    const User = await user.create({
        fullname: name, 
        numphone: null, 
        googleId: '',
        facebookId: userID,
        gender: '',
        email: email,
        password: bcrypt.hashSync("000000", 10),
        role: "user",
        token: null ,
        active: true
    });
    if(!User){
        return response.status(400).json({
            message:  "Something Wrong!!! try again"
        })
    }
    return response.status(200).json({
        message: 'Success',
        data: User||[]
    })
}));

module.exports = router;