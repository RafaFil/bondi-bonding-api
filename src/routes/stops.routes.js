const { Router } = require("express");
const { getStops, getStopById, getStopsGeo } = require("../controllers/stops.controller");

const STOPS_ROUTE = '/stops';
const stopsRouter = Router();

stopsRouter.get(STOPS_ROUTE, async (req, res) => {
    return getStops(req, res);
});

stopsRouter.get(`${STOPS_ROUTE}/geo`, async (req, res) => {
    return getStopsGeo(req, res);
});

stopsRouter.get(`${STOPS_ROUTE}/:stopId`, async (req, res) => {
    return getStopById(req, res);
});

module.exports = stopsRouter;