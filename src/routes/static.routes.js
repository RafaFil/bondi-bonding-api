var express = require('express');
var router = express.Router();
const {getAllFaqs, getAllTos} = require('../controllers/static.controller')
const baseRoute = '/routes'

router.get(`${baseRoute}/faqs`, getAllFaqs);

router.get(`${baseRoute}/tos`, getAllTos);

module.exports = router;