const { Router } = require('express');
const { editProfile, getPubProfile, getPrivateProfile } = require('../controllers/profile.controller');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const BASE_ROUTE = '/profile';
const profileRouter = Router();
profileRouter.use(BASE_ROUTE, validateJWT);

profileRouter.get(`${BASE_ROUTE}/:username`, async (req,res) => {
    if (req.username === req.params.username) {
        return getPrivateProfile(req, res);
    }
    return getPubProfile(req, res);
});

profileRouter.patch(`${BASE_ROUTE}/:username`, async (req, res) => {
    if (req.username !== req.params.username) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    return editProfile(req, res);
});

module.exports =  profileRouter;