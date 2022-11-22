const {Router} = require('express');
const {createUser} = require('../controllers/user.controller');
const { validateBody } = require('../middlewares/validateBody.middleware');

const USER_ROUTE = '/user';
const userRouter = Router();

userRouter.post(USER_ROUTE, validateBody, async (req,res) =>{
    return createUser(req,res);
});


module.exports =  userRouter;