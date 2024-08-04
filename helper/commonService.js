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

exports.uploadImage = (filePath, reqFiles,folder) => {
  console.log("filepath",filePath)
  let dirCreate = `public/uploads/${folder}`;
let tempPath = reqFiles;
// console.log("temppath",tempPath)

  let targetPath = `public/uploads/${filePath}`;

   // Check if directory exists, if not create it
   if (!fs.existsSync(dirCreate)) {
    fs.mkdirSync(dirCreate, { recursive: true });
  }

  // Move the file to the target path
  try {
    reqFiles.mv(targetPath);
    console.log("File uploaded successfully to", targetPath);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

exports.getImageExtension = (filePath) => {
  const extension = filePath.substr(filePath.lastIndexOf(".") + 1) || "";
  const validExtensions = ["jpg", "jpeg", "png"];
  
  if (!validExtensions.includes(extension.toLowerCase())) {
    throw `Invalid file type. Only jpg, jpeg, and png files are allowed.`
  }
  
  return extension.toLowerCase();
};




