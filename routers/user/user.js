const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const user = require('../../models').User;


router.get('/:id',asyncHandler(async function(request, response){
    const User = await user.findById(request.params.id);
    if(!User){
        response.status(400).json({
            status : "400",
            message : "Something Wrong!!! try again"
        });
    }
    let data = {};
    if (User.role === "staff") {
        data = {
            id: User.id,
            email: User.email,
            fullname: User.fullname,
            active: User.active,
            isAdmin: true
        }
    } else {
        data = {
            id: User.id,
            email: User.email,
            fullname: User.fullname,
            active: User.active,
            isAdmin: false
        }

    }
    response.status(200).json({
        status : "200",
        message : "Success",
        data: data || []
    });
     
  }));
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
const lock_multiple = async(list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp = await user.update({ role: 'lock' , active: false}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}
const active_multiple = async(list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp =  await user.update({ role: 'user' , active: true}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}
const update_multiple = async(list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp =  await user.update({ role: 'staff' , active: true}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}

router.post('/update', asyncHandler(async function (request, response) {
    const { listId } = request.body;
    if (listId) {
        let result = await update_multiple(listId);
        let newUsers = await user.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){            
            return response.status(200).send({ 
                Status: 'Complete',
                data:newUsers});
        }
       
    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));
router.post('/lock', asyncHandler(async function (request, response) {
    const { listId } = request.body;
    if (listId) {
        let result = await lock_multiple(listId);
        let newUsers = await user.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){            
            return response.status(200).send({ 
                message: 'Complete',
                data:newUsers});
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
        let newUsers = await user.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){
            return response.status(200).send({ 
                Status: 'Complete',
                data:newUsers
            });
        }

    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));

module.exports = router;