const asyncHandler = require('express-async-handler')
const express =  require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../../models').User;
router.post('/',asyncHandler(async function(request, response){
    let {email, password} =  request.body;
    const found = await User.findByEmail(email);
    //console.log(bcrypt.hashSync('123456',10));
    if(found){
       if(found.active === true && bcrypt.compareSync(password,found.password)){
        console.log('Complete');
        return response.status(200).send( { Status: 'Complete',
                                            user:found.dataValues});
      }if(found.active === true && !bcrypt.compareSync(password,found.password)){
        console.log('Password wrong!');
        return response.status(400).send({ Status:"Password wrong!"});
      }
      else if(found.active === false){
        return response.status(400).send({ Status:'Please active acc!'});
      }
    }else{
      console.log('Not found');
      return response.status(400).send({ Status:'Email is not exist.'});
    }
     
  }));
  
module.exports = router;