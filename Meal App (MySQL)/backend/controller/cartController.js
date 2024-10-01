const Cart = require("../models/cart");
const Razorpay = require("razorpay");
const User = require("../models/user");
const Order = require("../models/order");
const dotenv = require("dotenv").config();

module.exports.Cart = async function (req, res) {
  const { userId } = req.query;
  const cartItems = await Cart.findAll({ where: { userId: userId } });
  return res.status(200).json({
    cartItems,
  });
};

module.exports.Increase = async function (req, res) {
  const { id, quantity, price } = req.body;
  try {
    const [updatedRows] = await Cart.update(
      {
        quantity: Number(quantity) + 1,
        total: (Number(quantity) + 1) * Number(price),
      },
      { where: { itemId: id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    const updatedItem = await Cart.findOne({ where: { itemId: id } });
    return res.status(200).json({
      total: updatedItem.total,
      quantity: updatedItem.quantity,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the item" });
  }
};

module.exports.Decrease = async function (req, res) {
  const { id, quantity, price } = req.body;
  try {
    const newQuantity = Math.max(Number(quantity) - 1, 1); // Ensure quantity is at least 1
    const newTotal = Math.max(
      (Number(quantity) - 1) * Number(price),
      Number(price)
    );
    const [updatedRows] = await Cart.update(
      {
        quantity: newQuantity,
        total: newTotal,
      },
      { where: { itemId: id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    const updatedItem = await Cart.findOne({ where: { itemId: id } });
    return res.status(200).json({
      total: updatedItem.total,
      quantity: updatedItem.quantity,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the item" });
  }
};

module.exports.Delete = async function (req, res) {
  const { itemId, userId } = req.query;
  const removed = await Cart.destroy({
    where: { itemId: itemId, userId: userId },
  });
  return res.status(200).json({
    removed,
  });
};

module.exports.CreateOrder = async function (req, res) {
  const { userId, Orders, amount, address } = req.body;
  try {
    let razorpayInstance = new Razorpay({
      key_id: process.env.Razorpay_key_id,
      key_secret: process.env.Razorpay_key_secret,
    });
    let user = await User.findOne({ where: { id: userId } });
    let order = await razorpayInstance.orders.create({
      amount: 2500,
      currency: "INR",
    });
    let data = await Order.create({
      orderId: order.id,
      paymentId: "coming soon",
      status: "PENDING",
      total: amount,
      orders: Orders,
      address: address,
      userId: userId,
    });
    return res.status(200).json({
      success: true,
      msg: "Order Created",
      order_id: order.id,
      amount: amount,
      key_id: process.env.Razorpay_key_id,
      userId: user.id,
      contact: user.phone,
      name: user.name,
      email: user.email,
      data: data,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ success: false, msg: "Something went wrong!" });
  }
};
