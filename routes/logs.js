var express = require('express');
var router = express.Router();
const winston = require('winston');
const LogService = require('../services/log-service');

/* GET log listing. */
router.get('/', function (req, res, next) {
  LogService.find()
    .then(data => {
      res.render('index', {data: data});
    })
    .catch(err => {
      res.render(err);
    });
});

router.post('/', function (req, res, next) {
  var log = {
    flavor: req.body.flavor,
    ticket: req.body.ticket,
  };
  LogService.create(log)
    .then(data => {
      res.redirect('/');
    })
    .catch(err => {
      res.render(err);
    });
});

router.get('/create', function (req, res, next) {
  res.render('createLog');
});

module.exports = router;
