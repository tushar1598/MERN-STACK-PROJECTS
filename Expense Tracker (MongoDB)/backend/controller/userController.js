const User = require("../models/user");
const Expense = require("../models/expense");
const Order = require("../models/order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
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
      ispremiumuser: "false",
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

module.exports.Addexpense = async function (req, res) {
  const { userId, amount, description, category } = req.body;
  let expense = await Expense.create({
    amount,
    description,
    category,
    userId: userId,
  });
  return res.status(200).json({
    expense,
  });
};

module.exports.Getexpenses = async function (req, res) {
  let expenses = await Expense.find({ userId: req.user.id });
  return res.status(200).json({
    expenses,
  });
};

module.exports.Expensedelete = async function (req, res) {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  return res.status(200).json({
    deleted: true,
  });
};

module.exports.Getexpenseupdate = async function (req, res) {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  return res.status(200).json({
    expense,
  });
};

module.exports.Expenseupdated = async function (req, res) {
  const { _id, amount, description, category } = req.body;
  let expenseupdated = await Expense.findByIdAndUpdate(_id, {
    amount,
    description,
    category,
  });
  return res.status(200).json({
    expenseupdated,
  });
};

module.exports.Createorder = async function (req, res) {
  const { userId } = req.body;
  const user = await User.findById(userId);
  const razorpayInstance = new Razorpay({
    key_id: process.env.RazorPayKeyId,
    key_secret: process.env.RazorPaySecret,
  });
  const amount = 2500;
  let order = await razorpayInstance.orders.create({ amount, currency: "INR" });

  let data = await Order.create({
    orderId: order.id,
    paymentId: "coming soon",
    status: "PENDING",
    userId: userId,
  });

  if (order) {
    return res.status(200).json({
      success: true,
      msg: "Order Created",
      order_id: order.id,
      amount: amount,
      key_id: process.env.RazorPayKeyId,
      id: user._id,
      contact: user.phone,
      name: user.name,
      email: user.email,
      data: data,
    });
  } else {
    res.status(400).send({ success: false, msg: "Something went wrong!" });
  }
};

module.exports.Getorder = async function (req, res) {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RazorPayKeyId,
    key_secret: process.env.RazorPaySecret,
  });
  const orders = await Order.find({ userId: req.user.id });
  const order = orders[orders.length - 1];
  if (order) {
    let orderId = order.orderId;
    let payment = await razorpayInstance.orders.fetchPayments(orderId);
    if (payment.items.length == 0) {
      return res.status(200).json({
        message: "Order created",
        status: "PENDING",
      });
    }
    let status = payment.items[0].status;
    if (status == "captured") {
      await Order.findByIdAndUpdate(order._id, {
        paymentId: payment.items[0].id,
        status: "SUCCESS",
      });
      updatePremium(req.user.id);
    } else if (status == "failed") {
      await Order.findByIdAndUpdate(order._id, {
        paymentId: payment.items[0].id,
        status: "FAILED",
      });
    }
  }
};

async function updatePremium(id) {
  let order = await Order.find({ userId: id, status: "SUCCESS" });
  if (order.length > 0) {
    await User.findByIdAndUpdate(id, { ispremiumuser: "true" });
  }
}

module.exports.Premiumuser = async function (req, res) {
  let premiumuser = await User.findOne({
    _id: req.user.id,
    ispremiumuser: "true",
  });
  if (premiumuser) {
    return res.status(200).json({
      message: "you are a premium user",
      premium: true,
    });
  } else {
    return res.status(200).json({
      message: "you are a not premium user",
      premium: false,
    });
  }
};
