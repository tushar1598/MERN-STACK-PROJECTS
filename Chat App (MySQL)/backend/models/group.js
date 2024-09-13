const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define("groups", {
  group: Sequelize.STRING,
});

module.exports = Group;
