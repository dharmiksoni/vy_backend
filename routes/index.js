var express = require('express');
var router = express.Router();

router.use('/vy/api/v1/', require('./../api/controllers'));

module.exports = router;
