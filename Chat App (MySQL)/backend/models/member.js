const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Member = sequelize.define("members", {
  member: Sequelize.STRING,
});

module.exports = Member;
