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
            limit = parseInt(options.perPage);
            if (options.page) {
              page = parseInt(options.page);
              skip = page * limit;
            }
          }
        }

        LogModel.find(query, null, {sort: {createdAt: -1}, skip: skip, limit: limit}, function (err, data) {
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
}

module.exports = new LogService();
