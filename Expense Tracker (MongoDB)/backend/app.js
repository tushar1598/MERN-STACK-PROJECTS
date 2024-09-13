const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/mongoose");
const dotenv = require("dotenv").config();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.url, // React frontend URL
    credentials: true, // Enable cookies and other credentials
  })
);

app.use("/", require("./routes"));

app.listen(process.env.port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is running successfully on port:: ${process.env.port}!!`);
});
