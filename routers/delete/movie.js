const asyncHandler = require('express-async-handler')
const express =  require('express');
const router = express.Router();
const Movie = require('../../models').Movie;

const destroy_multiple = (list) => {
    let temp ;
    for (let i = 0; i < list.length; i++) {
        let id = list[i];
         temp = Movie.destroy({
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
        if (result){            
            let new_list =await Movie.findAll();
            return response.status(200).send({ Status: 'Complete',new_list:new_list });
        }
       
    }
    else {
        return response.status(400).send({ Status: 'Error' });
    }
}));

module.exports = router;