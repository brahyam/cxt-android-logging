'use strict';
const LogModel = require('../models/log-model');
const mongoDb = require('mongodb');
const winston = require('winston');

class LogService {

  create(log) {
    return new Promise(
      function (resolve, reject) {
        var newLog = LogModel({
          data: log.data,
          _uploader: log._uploader,
          ticket: log.ticket,
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

        LogModel.find(query, function (err, data) {
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
