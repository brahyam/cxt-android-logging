'use strict';
const LogModel = require('../models/log-model');
const winston = require('winston');

class LogService {

  create(log) {
    return new Promise(
      function (resolve, reject) {
        var newLog = LogModel({
          data: log.data,
          _uploader: log._uploader,
          ticket: log.ticket
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
}

module.exports = new LogService();
