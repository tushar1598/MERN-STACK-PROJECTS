const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const dotenv = require("dotenv").config();

module.exports.Createuser = async function (req, res) {
  const { name, email, phone, password } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  let alreadyuser = await User.findOne({ email: email });
  let alreadyusernumber = await User.findOne({ phone: phone });
  if (!alreadyuser && !alreadyusernumber) {
    let Password = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      phone,
      password: Password,
      profileImage: `/uploads/${profileImage}`,
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
        user: process.env.email,
        pass: process.env.passcode,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    transporter.sendMail({
      from: user.email,
      to: process.env.email,
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

module.exports.Getprofile = async function (req, res) {
  const { userId } = req.query;
  const user = await User.findById(userId);
  return res.status(200).json({
    data: user,
  });
};

module.exports.Editprofile = async function (req, res) {
  const { _id, name, email, phone } = req.body;
  const updated = await User.findByIdAndUpdate(_id, {
    name,
    email,
    phone,
  });
  return res.status(200).json({
    updated,
  });
};

module.exports.Profilephoto = async function (req, res) {
  const { id } = req.params;
  const imagePath = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    id,
    { profileImage: imagePath },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ profileImage: user.profileImage });
};

module.exports.Search = async function (req, res) {
  const { query } = req.query;
  const collection = mongoose.connection.db.collection("Items");
  try {
    const products = await collection
      .find({
        name: { $regex: query, $options: "i" }, // Case-insensitive search
      })
      .toArray();

    return res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};

module.exports.fetchOrders = async function (req, res) {
  const { userId } = req.query;
  const collection = mongoose.connection.db.collection("orders");
  const orders = await collection.find({ userId: userId }).toArray();
  return res.status(200).json({
    orders,
  });
};

module.exports.Getordersactions = async function (req, res) {
  const { userId } = req.query;
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.Razorpay_key_id,
      key_secret: process.env.Razorpay_key_secret,
    });
    let collection = mongoose.connection.db.collection("orders");
    const orders = await collection.find({ userId: userId }).toArray();
    const order = orders[orders.length - 1];
    if (order) {
      let orderId = order.orderId;
      let payment = await razorpayInstance.orders.fetchPayments(orderId);
      if (payment.items.length == 0) {
        return res.status(200).json({
          message: "Order created",
          status: "PENDING",
        });
      } else {
        let status = payment.items[0].status;
        if (status == "captured") {
          await collection.findOneAndUpdate(
            { _id: order._id },
            {
              $set: {
                paymentId: payment.items[0].id,
                status: "SUCCESS",
              },
            },
            { returnDocument: "after" }
          );
        } else if (status == "failed") {
          await collection.findOneAndUpdate(
            { _id: order._id },
            {
              $set: {
                paymentId: payment.items[0].id,
                status: "FAILED",
              },
            },
            { returnDocument: "after" }
          );
        }
      }
    }
  } catch (err) {
    return res
      .status(200)
      .send({ success: false, msg: "Something went wrong!" });
  }
};
