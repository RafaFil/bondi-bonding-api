const { Router } = require('express');
const { updateFilters } = require('../controllers/filters.controller');

const FILTERS_ROUTE = '/filters';
const filtersRouter = Router();

filtersRouter.put(`${FILTERS_ROUTE}/:username`, async (req,res) => {
    if (req.username !== req.params.username) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    return updateFilters(req, res);
});

module.exports =  filtersRouter;