const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const User = require('../../models').User;

const destroy_multiple = (list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
        temp =  User.update({ role: 'lock' , active: false}, {
            where: {
                id: id
            }
        })
    }
    return temp;
}
router.post('/', asyncHandler(async function (request, response) {
    const { listId } = request.body;
    if (listId) {
        let result = await destroy_multiple(listId);
        let new_list = await User.findAll({
            attributes: ['id','email','numphone','role','active','fullname']
          });
        if (result){            
            return response.status(200).send({ Status: 'Complete',new_list:new_list});
        }
       
    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));

module.exports = router;