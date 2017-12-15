var express = require('express');
var router = express.Router();
const winston = require('winston');
const utils = require('./utils');
const LogService = require('../services/log-service');

const ACRA_TICKET_NAME_FIELD = 'TICKET_NAME';
const ACRA_CLIENT_NAME_FIELD = 'CLIENT_NAME';
const ACRA_SCREENSHOT_URL_FIELD = 'SCREENSHOT_URL';
const RESULTS_SHOULD_HAVE_LOG_CAT_BY_DEFAULT = true;

/**
 * Get all logs
 */
router.get('/', function (req, res, next) {
  // Defaults
  var page = 0;
  var perPage = 100;
  var slim = !RESULTS_SHOULD_HAVE_LOG_CAT_BY_DEFAULT;

  if (req.query.page && req.query.page > 0) {
    winston.silly('query page='+req.query.page);
    page = req.query.page;
  }

  if (req.query.perPage && req.query.perPage > 0) {
    winston.silly('query perPage='+req.query.perPage    );
    perPage = req.query.perPage;
  }

  if (req.query.slim){
    slim = (req.query.slim === 'true');
  }

  LogService.find({pagination: true, perPage: perPage, page: page, slim:slim})
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

  // Process ticket name
  winston.info('POST logs/api');

  winston.silly('Request body:', req.body);

  var log = {
    androidVersion: req.body.ANDROID_VERSION,
    versionCode: req.body.APP_VERSION_CODE,
    versionName: req.body.APP_VERSION_NAME,
    deviceId: req.body.DEVICE_ID,
    installationId: req.body.INSTALLATION_ID,
    isSilent: req.body.IS_SILENT,
    logCat: req.body.LOGCAT,
    packageName: utils.getFlavorNameFromPackage(req.body.PACKAGE_NAME),
    phoneModel: req.body.PHONE_MODEL,
    phoneBrand: req.body.BRAND,
    reportId: req.body.REPORT_ID,
    stackTrace: req.body.STACK_TRACE,
    userIp: req.body.USER_IP,
    ticket: utils.getCustomData(ACRA_TICKET_NAME_FIELD, req.body.CUSTOM_DATA),
    screenshotUrl: utils.getCustomData(ACRA_SCREENSHOT_URL_FIELD, req.body.CUSTOM_DATA)
  };

  // Add client name if present.
  var clientName = utils.getCustomData(ACRA_CLIENT_NAME_FIELD, req.body.CUSTOM_DATA);
  if (clientName) {
    log.packageName = log.packageName + '-' + clientName;
  }

  // Add files if present
  if (req.files) {
    log.date = req.files.logFile.data;
    log.contentType = req.files.logFile.mimetype;
  }

  winston.silly('Final Log object to save:', log);

  LogService.create(log)
    .then(data => {
      res.status(200).send({status: 'OK', message: 'Log Created'});
    })
    .catch(err => {
      res.status(300).send({status: 'ERROR', message: err.message});
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
  var slim = !RESULTS_SHOULD_HAVE_LOG_CAT_BY_DEFAULT;
  if (req.query.slim){
      slim = (req.query.slim === 'true');
  }
  LogService.find({query: {id: req.params.id}, slim:slim})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
