const mongoose = require("mongoose");
const User = require("../models/user");
const Razorpay = require("razorpay");
const dotenv = require("dotenv").config();

module.exports.Items = async function (req, res) {
  const { id } = req.params;
  const collection = mongoose.connection.db.collection("carts");
  const data = await collection.find({ userId: id }).toArray();
  return res.status(200).json({
    items: data,
  });
};

module.exports.RemoveItems = async function (req, res) {
  const { id, userId } = req.query;
  const collection = mongoose.connection.db.collection("carts");
  const removed = await collection.deleteOne({ itemId: id, userId: userId });
  return res.status(200).json({
    removed: true,
  });
};

module.exports.CreateOrder = async function (req, res) {
  let { userId, Orders, amount } = req.body;
  try {
    let razorpayInstance = new Razorpay({
      key_id: process.env.Razorpay_key_id,
      key_secret: process.env.Razorpay_key_secret,
    });
    let user = await User.findById(userId);
    let collection = mongoose.connection.db.collection("orders");
    let order = await razorpayInstance.orders.create({
      amount: 2500,
      currency: "INR",
    });
    if (order) {
      let data = await collection.insertOne({
        orderId: order.id,
        paymentId: "coming soon",
        status: "PENDING",
        userId: userId,
        total: amount,
        orders: Orders,
      });
      return res.status(200).json({
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: amount,
        key_id: process.env.Razorpay_key_id,
        userId: user._id,
        contact: user.phone,
        name: user.name,
        email: user.email,
        data: data,
      });
    }
  } catch (err) {
    return res
      .status(200)
      .send({ success: false, msg: "Something went wrong!" });
  }
};
