const express = require("express");
const port = 9000;
const app = express();
const path = require("path");
const User = require("./models/user");
const Item = require("./models/items");
const Cart = require("./models/cart");
const Address = require("./models/address");
const Order = require("./models/order");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.frontend_url,
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", require("./routes"));

sequelize
  .sync()
  .then(() => {
    app.listen(port, function (err) {
      console.log(`Server is running successfully on port:: ${port}!!`);
    });
  })
  .catch((err) => console.log(err));
