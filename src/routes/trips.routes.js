const { Router } = require("express");
const { createTrip } = require("../controllers/trips.controller");
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const BASE_ROUTE = '/trips';
const tripsRouter = Router();

tripsRouter.use(validateJWT);

tripsRouter.get(BASE_ROUTE, async (req, res) => {
    return getTrips(req, res);
});

tripsRouter.get(`${BASE_ROUTE}/:tripId`, async (req, res) => {
    return getTripById(req, res);
});

tripsRouter.post(BASE_ROUTE, async (req, res) => {
    return createTrip(req, res);
});

module.exports = tripsRouter;