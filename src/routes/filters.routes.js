const { Router } = require('express');
const { updateFilters } = require('../controllers/filters.controller');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const BASE_ROUTE = '/filters';
const filtersRouter = Router();
filtersRouter.use(BASE_ROUTE, validateJWT);

filtersRouter.put(`${BASE_ROUTE}/:username`, async (req,res) => {
    if (req.username !== req.params.username) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    return updateFilters(req, res);
});

module.exports =  filtersRouter;