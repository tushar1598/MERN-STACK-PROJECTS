const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("users", {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  password: Sequelize.STRING,
  profileImage: Sequelize.STRING,
});

module.exports = User;
