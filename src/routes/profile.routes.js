const { Router } = require('express');
const { editProfile, getPubProfile, getPrivateProfile } = require('../controllers/profile.controller');

const USER_ROUTE = '/profile';
const profile = Router();

profile.get(`${USER_ROUTE}/:username`, async (req,res) => {
    if (req.username === req.params.username) {
        return getPrivateProfile(req, res);
    }
    return getPubProfile(req, res);
});

profile.patch(`${USER_ROUTE}/:username`, async (req, res) => {
    return editProfile(req,res);
});

module.exports =  profile;