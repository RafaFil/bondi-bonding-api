const { Router } = require('express');
const { editProfile, getPubProfile, getPrivateProfile } = require('../controllers/profile.controller');

const PROFILE_ROUTE = '/profile';
const profileRouter = Router();

profileRouter.get(`${PROFILE_ROUTE}/:username`, async (req,res) => {
    if (req.username === req.params.username) {
        return getPrivateProfile(req, res);
    }
    return getPubProfile(req, res);
});

profileRouter.patch(`${PROFILE_ROUTE}/:username`, async (req, res) => {
    if (req.username !== req.params.username) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    return editProfile(req, res);
});

module.exports =  profileRouter;