const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../models').User;


router.post('/', asyncHandler(async function (request, response) {
    const { googleId,name, email} = request.body;
    const google_user = await user.findByGoogleId(googleId)
    if(google_user){
        if(google_user.role === 'lock'){
            return response.status(200).json({
                message: " Google User is lock",
                data: []
            })
        }
        return response.status(200).json({
            message: "Find Google User",
            data: google_user||[]
        })
    }
    const User = await user.create({
        fullname: name, 
        numphone: null, 
        googleId: googleId,
        facebookId: '',
        gender: '',
        email: email,
        password: bcrypt.hashSync("000000", 10),
        role: 'user',
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