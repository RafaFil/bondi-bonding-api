const { Router } = require("express");
const { getLines, getLineById } = require("../controllers/lines.controller");

const LINES_ROUTE = '/lines';
const linesRouter = Router();

linesRouter.get(LINES_ROUTE, async (req, res) => {
    return getLines(req, res);
});

linesRouter.get(`${LINES_ROUTE}/:lineId`, async (req, res) => {
    return getLineById(req, res);
});

module.exports = linesRouter;