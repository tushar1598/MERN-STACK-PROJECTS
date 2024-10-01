const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define("items", {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.STRING,
  image: Sequelize.STRING,
});

module.exports = Item;
