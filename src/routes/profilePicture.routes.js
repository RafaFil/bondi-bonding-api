const { Router } = require("express");
//const { getStops, getStopById, getStopsGeo } = require("../controllers/stops.controller");

const BASE_ROUTE = '/profilePicture';
const profilePictureRouter = Router();

profilePictureRouter.get(BASE_ROUTE, async (req, res) => {
    res.status(200).json({});
});

profilePictureRouter.post(BASE_ROUTE, async (req, res) => {
    console.log('req.body: ', req.body);
    res.status(200).json({});
});

module.exports = profilePictureRouter;