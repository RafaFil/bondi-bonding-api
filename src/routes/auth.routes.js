const { Router } = require("express");
const { doAuth } = require("../controllers/auth.controller");

const BASE_ROUTE = '/auth';
const authRouter = Router();

authRouter.post(BASE_ROUTE, async (req, res) => {
    return doAuth(req, res);
});

module.exports = authRouter;