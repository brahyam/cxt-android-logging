'use strict';
const LogModel = require('../models/log-model');
const mongoDb = require('mongodb');
const winston = require('winston');

class LogService {

  create(log) {
    return new Promise(
      function (resolve, reject) {
        var newLog = new LogModel({
          androidVersion: log.androidVersion,
          versionCode: log.versionCode,
          versionName: log.versionName,
          deviceId: log.deviceId,
          installationId: log.installationId,
          isSilent: log.isSilent,
          logCat: log.logCat,
          packageName: log.packageName,
          phoneModel: log.phoneModel,
          phoneBrand: log.phoneBrand,
          reportId: log.reportId,
          stackTrace: log.stackTrace,
          userIp: log.userIp,
          ticket: log.ticket,
          screenshotUrl: log.screenshotUrl,
          data: log.data,
          _uploader: log._uploader,
          contentType: log.contentType
        });

        newLog.save(function (err) {
          if (err) {
            reject(err);
          }
          else {
            resolve(newLog);
          }
        })
      }
    )
  }

  find(options) {
    return new Promise(
      function (resolve, reject) {
        // Defaults
        var page = 0;
        var skip = 0;
        var limit = 100;
        var query = null;

        if (options) {
          // If searching objects by ID, need to replace string id with objectId from Mongo
          if (options.query && options.query.id) {
            options.query._id = new mongoDb.ObjectID(options.query.id);
            delete options.query.id;
          }
          query = options.query;

          // Calculate pagination
          if (options.pagination) {
            winston.silly('options perPage=' + options.perPage);
            limit = parseInt(options.perPage);
            winston.silly('limit=' + limit);
            if (options.page) {
              page = parseInt(options.page);
              skip = page * limit;
              winston.silly('page=' + page);
              winston.silly('skip=' + skip);
            }
          }

          // Parse slim option
          var fields = null;
          if (options.slim) {
            fields = {logCat: 0};
          }
        }

        LogModel.find(query, fields, {sort: {_id: -1}, skip: skip, limit: limit}, function (err, data) {
          if (err) {
            reject(err);
          }
          else {
            resolve({page: page, count: limit, data: data});
          }
        })
      }
    )
  }

  delete(id) {
    return new Promise(
      function (resolve, reject) {
        LogModel.findByIdAndRemove(id, function (err, log) {
          if (err) {
            reject(err);
          }
          else {
            resolve(log);
          }
        })
      }
    )
  }

  deleteOld() {
    return new Promise(
      function (resolve, reject) {
        // Calculate 1 month ago date
        const removalDate = new Date();
        removalDate.setMonth(removalDate.getMonth() - 1);
        LogModel.remove(
          {
            'createdAt':
              {
                '$lte': removalDate
              }
          }, function (err) {
            if (err) {
              winston.debug('Removal successful');
              reject();
            }
            else {
              winston.debug('Removal returned ' + err);
              resolve();
            }
          })
      }
    )
  }
}

module.exports = new LogService();
