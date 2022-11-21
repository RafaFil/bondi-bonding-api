const {Router} = require('express');
const {registerUser} = require('../controllers/user.controller');
const { validateBody } = require('../middlewares/validateBody.middleware');

const USER_ROUTE = '/user';
const userRouter = Router();

userRouter.post(USER_ROUTE, validateBody, async (req,res) =>{
    return registerUser(req,res);
});


module.exports =  userRouter;