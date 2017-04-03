'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  data: {type: Buffer},
  contentType: {type: String},
  ticket: {type: String},
  _uploader: {type: Schema.Types.ObjectId, ref: 'user'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

const logModel = mongoose.model('log', logSchema);

module.exports = logModel;
