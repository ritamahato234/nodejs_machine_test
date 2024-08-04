const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const questionController =require("../controllers/questionController")
const multer = require('multer');

const fs = require('fs');
const path = require('path');
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/uploads/'); // Directory for uploaded files
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  }
});
const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//List of all categories
router.get("/all-categories", questionController.getAllCategories);

// List of questions for each category
router.get("/questionsList/:categoryId", questionController.getquestions);
//upload question in bulk
router.post("/upload-questions", upload.single('file'),questionController.uploadQuestions);





module.exports = router;
