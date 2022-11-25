const { Router } = require("express");
const { createTrip, getTrips, getTripById, searchTrips } = require("../controllers/trips.controller");
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const BASE_ROUTE = '/trips';
const tripsRouter = Router();
tripsRouter.use(BASE_ROUTE, validateJWT);

tripsRouter.get(BASE_ROUTE, async (req, res) => {
    return await getTrips(req, res);
});

tripsRouter.get(`${BASE_ROUTE}/:tripId`, async (req, res) => {
    return await getTripById(req, res);
});

tripsRouter.post(BASE_ROUTE, async (req, res) => {
    return await createTrip(req, res);
});

tripsRouter.post(`${BASE_ROUTE}/search`, async (req, res) => {
    return await searchTrips(req, res);
});

module.exports = tripsRouter;