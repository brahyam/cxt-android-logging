'use strict';
const UserModel = require('../models/user-model');
const winston = require('winston');

class UserService {

  create(user) {
    return new Promise(
      function (resolve, reject) {
        var newUser = UserModel({
          email: user.name,
          password: user.password
        });

        newUser.save(function (err) {
          if (err) {
            reject(err);
          }
          else {
            resolve(newUser);
          }
        })
      }
    )
  }

  find(query) {
    return new Promise(
      function (resolve, reject) {
        UserModel.find(query, function (err, data) {
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

module.exports = new UserService();
