"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const fs = require("fs");
var path = require("path");



const commonService = require("./commonService");

exports.chechAuthToken = async (req, res, next) => {
  try {
    var token =
      req.body.authtoken || req.params.authtoken || req.headers["authtoken"];
    if (token) {
      const decode = await commonService.verifyToken(token);

      if (!decode) {
        throw { message: "basicErrorMessage" };
      }

      req.decoded = decode;
      console.log('decode',req.decoded)
      req.userId = decode._id;
      return next();
    } else {
      throw { success: false, message: "Access token is required", response: {} };
    }
  } catch (err) {
    res.send(err);
  }
};






