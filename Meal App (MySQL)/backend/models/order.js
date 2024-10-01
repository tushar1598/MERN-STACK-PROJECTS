const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("orders", {
  orderId: Sequelize.STRING,
  paymentId: Sequelize.STRING,
  status: Sequelize.STRING,
  total: Sequelize.STRING,
  orders: Sequelize.JSON,
  address: Sequelize.JSON,
  userId: Sequelize.STRING,
});

module.exports = Order;
