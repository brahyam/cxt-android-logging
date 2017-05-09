var express = require('express');
var router = express.Router();
const winston = require('winston');
const LogService = require('../services/log-service');

/**
 * Get all logs
 */
router.get('/', function (req, res, next) {
  LogService.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    });
});

/**
 * Create Log
 */
router.post('/', function (req, res, next) {

  var log = {
    androidVersion: req.body.ANDROID_VERSION,
    versionCode: req.body.APP_VERSION_CODE,
    versionName: req.body.APP_VERSION_NAME,
    deviceId: req.body.DEVICE_ID,
    installationId: req.body.INSTALLATION_ID,
    isSilent: req.body.IS_SILENT,
    logCat: req.body.LOGCAT,
    packageName: req.body.PACKAGE_NAME,
    phoneModel: req.body.PHONE_MODEL,
    reportId: req.body.REPORT_ID,
    stackTrace: req.body.STACK_TRACE,
    userIp: req.body.USER_IP,
    ticket: req.body.ticket
  };

  // Add files if present
  if (req.files) {
    log.date = req.files.logFile.data;
    log.contentType = req.files.logFile.mimetype;
  }

  LogService.create(log)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    });
});

/**
 * Deletes Log
 */
router.delete('/:id', function (req, res, next) {
  LogService.delete(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    });
});

/**
 * Get specific Log
 */
router.get('/:id', function (req, res, next) {
  LogService.find({id: req.params.id})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    });
});


module.exports = router;
