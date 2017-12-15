'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  data: {type: Buffer},
  contentType: {type: String},
  ticket: {type: String},
  screenshotUrl: {type: String},
  _uploader: {type: Schema.Types.ObjectId, ref: 'user'},
  // ACRA Fields
  androidVersion: {type: String},
  versionCode: {type: String},
  versionName: {type: String},
  deviceId: {type: String},
  installationId: {type: String},
  isSilent: {type: Boolean},
  logCat: {type: String},
  packageName: {type: String},
  phoneModel: {type: String},
  phoneBrand: {type: String},
  reportId: {type: String},
  stackTrace: {type: String},
  userIp: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

const logModel = mongoose.model('log', logSchema);

module.exports = logModel;
