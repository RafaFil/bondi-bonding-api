const { Router } = require('express');
const { startPasswordRecovery, verifyRecoveryCode, updatePassword } = require('../controllers/resetPassword.controller');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const BASE_ROUTE = '/resetPassword';
const resetPasswordRouter = Router();

resetPasswordRouter.post(`${BASE_ROUTE}/start`, async (req, res) => {
    return startPasswordRecovery(req, res);
});

resetPasswordRouter.post(`${BASE_ROUTE}/verify`, async (req, res) => {
    return verifyRecoveryCode(req, res);
});

resetPasswordRouter.patch(`${BASE_ROUTE}/update`, validateJWT, async (req, res) => {
    return updatePassword(req, res);
});

module.exports =  resetPasswordRouter;