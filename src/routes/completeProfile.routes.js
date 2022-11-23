const { Router } = require('express');
const { editProfile, getProfile } = require('../controllers/profile.controller');

const USER_ROUTE = '/profile';
const CompleteProfileRouter = Router();

CompleteProfileRouter.get(`${USER_ROUTE}/:username`, async (req,res) => {
    return getProfile(req, res);
});

CompleteProfileRouter.post(`${USER_ROUTE}/:username`, async (req, res) => {
    return editProfile(req,res);
});

module.exports =  CompleteProfileRouter;