var express = require('express');
var router = express.Router();
const winston = require('winston');
const LogService = require('../services/log-service');

/* GET log listing. */
router.get('/', function (req, res, next) {
  // Defaults
  var page = 0;
  var perPage = 15;

  if (req.query.page && req.query.page > 0) {
    page = req.query.page;
  }

  if (req.query.perPage && req.query.perPage > 0) {
    perPage = req.query.perPage;
  }

  LogService.find({pagination: true, perPage: perPage, page: page})
    .then(response => {
      res.render('index', response);
    })
    .catch(err => {
      res.render(err);
    });
});

router.get('/create', function (req, res, next) {
  res.render('createLog');
});

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
      res.redirect('/');
    })
    .catch(err => {
      res.render('error', {message: err});
    });
});

/**
 * Show log details
 */
router.get('/:id', function (req, res, next) {
  LogService.find({query: {id: req.params.id}})
    .then(response => {
      if (response.data.length > 0) {
        var log = response.data[0];
        res.render('logDetails', log);
      }
      else {
        res.render('error', {message: 'Log not found'});
      }
    })
    .catch(err => {
      res.render('error', {message: err})
    });
});

/**
 * Delete Log
 */
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

/**
 * Download log
 */
router.get('/download/:id', function (req, res, next) {
  LogService.find({query: {id: req.params.id}})
    .then(response => {
      var log = response.data[0];
      var fileName;
      if (log.ticket) {
        fileName = log.ticket;
      }
      else {
        fileName = log.packageName + log.createdAt.getTime();
      }
      res.status(200);
      res.set({
        'Content-Type': 'application/force-download',
        'Content-disposition': 'attachment; filename=logCat-' + fileName + '.txt'
      });
      res.end(log.logCat);
    })
    .catch(err => {
      res.render('error', {message: err})
    });
});

/**
 * Create new log (API CALL)
 */
router.post('/api', function (req, res, next) {
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
    packageName: getFlavorNameFromPackage(req.body.PACKAGE_NAME),
    phoneModel: req.body.PHONE_MODEL,
    phoneBrand: req.body.BRAND,
    reportId: req.body.REPORT_ID,
    stackTrace: req.body.STACK_TRACE,
    userIp: req.body.USER_IP,
    ticket: getTicketNameFromCustomData(req.body.CUSTOM_DATA)
  };

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
      res.status(300).send({status: 'FAIL', message: err.message});
    });
});

module.exports = router;

/**
 * Gets an app package name and returns the last
 * module name capitalized
 * @param packageName String containing a package name i.e. com.connexient.medinav.uab
 * @return String containing last segment of package name capitalized i.e. Uab
 */
function getFlavorNameFromPackage(packageName) {
  var splittedName = packageName.split('.');
  var flavorName = splittedName[splittedName.length - 1];
  return flavorName.substring(0, 1).toUpperCase() + flavorName.substring(1);
}

/**
 * Gets all custom data values and returns only the ticket name
 * @param customData String containing all report custom data (value pairs)
 * @return String containing ticket name
 */
function getTicketNameFromCustomData(customData) {
  const TICKET_NAME_KEY = 'TICKET_NAME';
  var keyValuePairs = customData.split(',');
  for (var i = 0; i < keyValuePairs.length; i++) {
    var splitedValue = keyValuePairs[i].split('=');
    if (splitedValue[0].trim().indexOf(TICKET_NAME_KEY) !== -1) {
      return splitedValue[1].trim();
    }
  }
}
