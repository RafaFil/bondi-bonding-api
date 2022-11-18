var express = require('express');
var router = express.Router();

const baseRoute = '/users'

router.get(baseRoute, async function(req, res, next) {
    res.status(200).send("hola")
});

module.exports = router;