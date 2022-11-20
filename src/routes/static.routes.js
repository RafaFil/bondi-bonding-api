const { Router } = require('express');
const { getAllFaqs, getAllTos } = require('../controllers/static.controller');

const BASE_ROUTE = '/static'
const staticRouter = Router();

staticRouter.get(`${BASE_ROUTE}/faqs`, getAllFaqs);

staticRouter.get(`${BASE_ROUTE}/tos`, getAllTos);

module.exports = staticRouter;