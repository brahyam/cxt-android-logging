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

  find(query) {
    return new Promise(
      function (resolve, reject) {
        // If searching objects by ID, need to replace string id with objectId from Mongo
        if (query && query.id) {
          query._id = new mongoDb.ObjectID(query.id);
          delete query.id;
        }

        LogModel.find(query, null, {sort: {createdAt: -1}}, function (err, data) {
          if (err) {
            reject(err);
          }
          else {
            resolve(data);
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
