const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define("carts", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.STRING,
  quantity: Sequelize.STRING,
  total: Sequelize.STRING,
  image: Sequelize.STRING,
  itemId: Sequelize.STRING,
  userId: Sequelize.STRING,
});

module.exports = Cart;
