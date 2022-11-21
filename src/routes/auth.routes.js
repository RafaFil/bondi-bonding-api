const { Router } = require("express");
const { doAuth, renewToken } = require("../controllers/auth.controller");
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const BASE_ROUTE = '/auth';
const authRouter = Router();

authRouter.post(BASE_ROUTE, async (req, res) => {
    return doAuth(req, res);
});

authRouter.get(`${BASE_ROUTE}/renew`, validateJWT, async (req, res) => {
    return renewToken(req, res);
});

module.exports = authRouter;