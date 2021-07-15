const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const user = require('../../models').User;


router.get('/',asyncHandler(async function(request, response){
    const User = await user.findAll({
      attributes: ['id','email','numphone','role','active','fullname']
    });
    if(!User){
        response.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    response.status(200).json({
        status : "200",
        message : "Success",
        data: User || []
    });
     
  }));
const lock_multiple = (list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp =  user.update({ role: 'lock' , active: false}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}
const active_multiple = (list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp =  user.update({ role: 'user' , active: true}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}
router.post('/lock', asyncHandler(async function (request, response) {
    const { listId } = request.body;
    if (listId) {
        let result = await lock_multiple(listId);
        let new_list = await user.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){            
            return response.status(200).send({ 
                Status: 'Complete',
                new_list:new_list});
        }
       
    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));
router.post('/active', asyncHandler(async function (request, response) {
    const { listId } = request.body;
    if (listId) {
        let result = await active_multiple(listId);
        let new_list = await user.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){
            return response.status(200).send({ 
                Status: 'Complete',
                new_list:new_list
            });
        }

    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));

module.exports = router;