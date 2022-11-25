const { Router } = require('express');
const { getMap } = require('../controllers/map.controller');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const BASE_ROUTE = '/map';
const mapRouter = Router();
mapRouter.use(BASE_ROUTE, validateJWT);

mapRouter.get(BASE_ROUTE, async (req, res) => {
    return await getMap(req, res);
});

module.exports = mapRouter;