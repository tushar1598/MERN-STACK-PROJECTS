const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("messages", {
  message: Sequelize.STRING,
  sender: Sequelize.STRING,
});

module.exports = Message;
