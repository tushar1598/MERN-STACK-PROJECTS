const User = require("../models/user");
const Message = require("../models/message");
const Group = require("../models/group");
const Member = require("../models/member");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

module.exports.Createuser = async function (req, res) {
  const { name, email, phone, password } = req.body;
  const Password = await bcrypt.hash(password, 10);
  const alreadyuser = await User.findOne({ where: { email: email } });
  const alreadynumber = await User.findOne({ where: { phone: phone } });
  if (!alreadyuser && !alreadynumber) {
    const user = await User.create({ name, email, phone, password: Password });
    return res.status(200).json({
      user,
    });
  }
  return res.status(200).json({
    user: null,
  });
};

module.exports.Createsession = async function (req, res) {
  const { email, password } = req.body;
  const userfound = await User.findOne({ where: { email: email } });
  if (userfound !== null) {
    let Password = await bcrypt.compare(
      password,
      userfound.dataValues.password
    );

    if (Password) {
      const Token = jwt.sign(
        {
          id: userfound.dataValues.id,
          name: userfound.dataValues.name,
          email: userfound.dataValues.email,
        },
        process.env.secretKey,
        { expiresIn: "2hr" }
      );
      return res.status(200).json({
        Token,
      });
    }
    return res.status(200).json({
      Password: false,
    });
  }
  return res.status(200).json({
    user: null,
  });
};

module.exports.Protected = async function (req, res) {
  return res.status(200).json({
    message: "Authentication Successfull",
    user: req.user,
  });
};

module.exports.Resetpasswordlink = async function (req, res) {
  const { email } = req.body;
  let user = await User.findOne({ where: { email: email } });
  if (user) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.user,
        pass: process.env.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    transporter.sendMail({
      from: user.email,
      to: process.env.user,
      subject: "Password Reset Link",
      html: `http://localhost:5173/users/reset-password/${user.id}`,
    });
    return res.status(200).json({
      message: "Reset Password Link Sent Successfully!!",
      link: true,
    });
  }
  return res.status(200).json({
    message: "user is not found",
    link: false,
  });
};

module.exports.Resetpassword = async function (req, res) {
  const { id, password } = req.body;
  let Password = await bcrypt.hash(password, 10);
  let reset = await User.update({ password: Password }, { where: { id: id } });
  return res.status(200).json({
    reset,
  });
};

module.exports.Messages = async function (req, res) {
  const { id } = req.params;
  const message = await Message.findAll({ where: { groupId: id } });
  return res.status(200).json({
    message,
  });
};

module.exports.Creategroup = async function (req, res) {
  const { group, userId } = req.body;
  const username = await User.findOne({ where: { id: userId } });
  const newGroup = await Group.create({ group, userId });
  await Member.create({
    member: username.dataValues.name,
    userId,
    groupId: newGroup.id,
  });
  return res.status(200).json({
    newGroup,
  });
};

module.exports.Fetchgroup = async function (req, res) {
  const members = await Member.findAll({ where: { userId: req.user.id } });
  const groups = [];
  for (let i of members) {
    const groupname = await Group.findOne({
      where: { id: i.dataValues.groupId },
    });
    const obj = {};
    obj.name = groupname.dataValues.group;
    obj.id = groupname.dataValues.id;
    groups.push(obj);
  }
  return res.status(200).json({
    groups,
  });
};

module.exports.Fetchusers = async function (req, res) {
  const members = await User.findAll({});
  return res.status(200).json({
    members,
  });
};

module.exports.Joingroup = async function (req, res) {
  const { userId, groupname, groupid, username } = req.body;
  const alreadyuserjoined = await Member.findOne({
    where: {
      userId,
      groupId: groupid,
    },
  });
  if (alreadyuserjoined === null) {
    const userjoined = await Member.create({
      member: username,
      userId,
      groupId: groupid,
    });
    return res.status(200).json({
      userjoined,
      joined: true,
      userId,
    });
  } else {
    return res.status(200).json({
      alreadyjoined: true,
    });
  }
};

module.exports.Fetchmembers = async function (req, res) {
  const members = await Member.findAll({});
  return res.status(200).json({
    members,
  });
};
