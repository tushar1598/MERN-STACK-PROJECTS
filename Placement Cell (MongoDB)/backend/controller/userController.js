const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

module.exports.Createuser = async function (req, res) {
  const { name, email, phone, password } = req.body;
  let alreadyuser = await User.findOne({ email: email });
  let alreadyusernumber = await User.findOne({ phone: phone });
  if (!alreadyuser && !alreadyusernumber) {
    let Password = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      phone,
      password: Password,
    });
    return res.status(200).json({
      message: "user created",
      user,
    });
  }
  return res.status(200).json({
    message: "user already founded",
    user: null,
  });
};

module.exports.Createsession = async function (req, res) {
  const { email, password } = req.body;
  const userfound = await User.findOne({ email: email });
  if (userfound !== null) {
    let Password = await bcrypt.compare(password, userfound.password);
    if (Password) {
      const Token = jwt.sign(
        { id: userfound._id, email: userfound.email },
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
  let user = await User.findOne({ email: email });
  if (user) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    transporter.sendMail({
      from: user.email,
      to: process.env.user,
      subject: "Password Reset Link",
      html: `http://localhost:5173/users/reset-password/${user._id}`,
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
  let reset = await User.findByIdAndUpdate(id, { password: Password });
  return res.status(200).json({
    reset,
  });
};
