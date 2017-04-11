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

router.get('/create', function (req, res, next) {
  res.render('createLog');
});

router.post('/', function (req, res, next) {
  if (!req.files) {
    res.render('error', {message: 'No file uploaded'});
  }
  else {
    var log = {
      ticket: req.body.ticket,
      data: req.files.logFile.data,
      contentType: req.files.logFile.mimetype
    };
    LogService.create(log)
      .then(data => {
        res.redirect('/');
      })
      .catch(err => {
        res.render('error', {message: err});
      });
  }
});

router.get('/:id', function (req, res, next) {
  LogService.find({id: req.params.id})
    .then(data => {
      if (data && data.length > 0) {
        var log = data[0];
        res.setHeader('content-type', log.contentType);
        res.send(log.data);
      }
      else {
        res.render('error', {message: 'log not found'});
      }
    })
    .catch(err => {
      res.render('error', {message: err})
    });
});

router.get('/delete/:id', function (req, res, next) {
  LogService.delete(req.params.id)
    .then(data => {
      if (data) {
        res.redirect('/');
      }
      else {
        res.render('error', {message: 'log not found'});
      }
    })
    .catch(err => {
      res.render('error', {message: err})
    });
});


module.exports = router;
