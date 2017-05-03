var express = require('express');
var router = express.Router();
const winston = require('winston');

router.get('/', function (req, res, next) {
  res.redirect('/logs');
});

module.exports = router;
