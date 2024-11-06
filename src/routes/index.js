var express = require('express');
var router = express.Router();

var routes = require('./routes')


router.use('/', routes);

module.exports = router;