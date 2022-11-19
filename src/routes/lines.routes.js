const { Router } = require("express");
const { getLines, getLinesById } = require("../controllers/lines.controller");

const LINES_ROUTE = '/lines';
const linesRouter = Router();

linesRouter.get(LINES_ROUTE, async (req, res) => {
    return getLines(req, res);
});

linesRouter.get(`${LINES_ROUTE}/:lineId`, async (req, res) => {
    return getLinesById(req, res);
});

module.exports = linesRouter;