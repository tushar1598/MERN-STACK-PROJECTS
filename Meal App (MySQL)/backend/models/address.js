const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("addresses", {
  name: Sequelize.STRING,
  phone: Sequelize.STRING,
  street: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  pincode: Sequelize.STRING,
  userId: Sequelize.STRING,
});

module.exports = Address;
