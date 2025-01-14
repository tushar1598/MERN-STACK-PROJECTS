const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/mongoose");
const dotenv = require("dotenv").config();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.origin,
    credentials: true,
  })
);

app.use("/", require("./routes"));

app.listen(process.env.port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is Running Successfully on port:: ${process.env.port}`);
});
