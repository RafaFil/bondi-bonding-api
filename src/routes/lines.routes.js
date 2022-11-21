const { Router } = require("express");
const { getLines, getLineById } = require("../controllers/lines.controller");
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const BASE_ROUTE = '/lines';
const linesRouter = Router();

linesRouter.use(validateJWT);

linesRouter.get(BASE_ROUTE, async (req, res) => {
    return getLines(req, res);
});

linesRouter.get(`${BASE_ROUTE}/:lineId`, async (req, res) => {
    return getLineById(req, res);
});

module.exports = linesRouter;