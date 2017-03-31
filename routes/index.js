var express = require('express');
var router = express.Router();
const winston = require('winston');
const LogService = require('../services/log-service');

router.get('/', function (req, res, next) {
  res.redirect('/logs');
});


module.exports = router;
