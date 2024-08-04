const mongoose = require("mongoose");
const config = require("./config");
const dbUrl = config.dbUrl;

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to database '+dbUrl))
    .catch(err => console.log(err+"connection failed"));

//mongo on connection emit
mongoose.connection.on("connected", function (err) {
    console.log("MongoDB connection successful");
   
  });
  //mongo on error emit
  mongoose.connection.on("error", function (err) {
    console.log("MongoDB Error: ", err);
  });
  //mongo on dissconnection emit
  mongoose.connection.on("disconnected", function () {
    console.log("mongodb disconnected and trying for reconnect");
  });    