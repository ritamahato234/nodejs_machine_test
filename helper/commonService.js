"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const fs = require("fs");
var path = require("path");

exports.sendResponseData=(res, statusCode, success, msg, data)=> {
    if (success == false) {
      console.log(data);
    }
    return res.send({
      statusCode: statusCode,
      success: success,
      message: msg,
      response: data,
    })
  };
  

exports.createUserAccessToken = (userTokenData) => {
  return jwt.sign(userTokenData, config.secretKey,{ expiresIn: '180d' });
};


exports.verifyToken = (data) => {
  return jwt.verify(data, config.secretKey);
};








