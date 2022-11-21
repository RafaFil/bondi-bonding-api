const { Router } = require('express');
const { getMap } = require('../controllers/map.controller');

const BASE_ROUTE = '/map'
const mapRouter = Router();

mapRouter.get(BASE_ROUTE, async (req, res) => {
    return await getMap(req, res);
});

module.exports = mapRouter;