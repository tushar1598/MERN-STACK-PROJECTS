const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const dotenv = require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Address = require("../models/address");
const Order = require("../models/order");
const Item = require("../models/items");
const { Op } = require("sequelize");

module.exports.Createuser = async function (req, res) {
  const { name, email, phone, password } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  let alreadyuser = await User.findOne({ where: { email: email } });
  let alreadyusernumber = await User.findOne({ where: { phone: phone } });
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

module.exports.Getprofile = async function (req, res) {
  const { userId } = req.query;
  const user = await User.findOne({ where: { id: userId } });
  return res.status(200).json({
    data: user.dataValues,
  });
};

module.exports.Editprofile = async function (req, res) {
  const { id, name, email, phone } = req.body;
  let updated = await User.update(
    {
      name,
      email,
      phone,
    },
    { where: { id: id } }
  );
  return res.status(200).json({
    updated,
  });
};

module.exports.Profilephoto = async function (req, res) {
  const { id } = req.params;
  const newImagePath = `/uploads/${req.file.filename}`;
  try {
    // Fetch the current profile image path
    const user = await User.findByPk(id, {
      attributes: ["profileImage"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const oldImagePath = user.profileImage;
    // Delete the old image file if it exists
    if (oldImagePath && oldImagePath !== newImagePath) {
      const fullOldImagePath = path.join(__dirname, "..", oldImagePath);
      fs.unlink(fullOldImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${err}`);
        }
      });
    }
    // Update the user's profile image path in the database
    const [updatedRows] = await User.update(
      { profileImage: newImagePath },
      { where: { id: id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ profileImage: newImagePath });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the profile photo" });
  }
};

module.exports.Search = async function (req, res) {
  const { query } = req.query;
  try {
    const products = await Item.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`, // Case-insensitive search
        },
      },
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};

module.exports.Address = async function (req, res) {
  const { name, phone, street, city, state, pincode, userId } = req.body;
  const address = await Address.create({
    name,
    phone,
    street,
    city,
    state,
    pincode,
    userId: userId,
  });
  return res.status(200).json({
    address,
  });
};

module.exports.FetchAddresses = async function (req, res) {
  const { id } = req.params;
  const addresses = await Address.findAll({ where: { userId: id } });
  return res.status(200).json({
    addresses,
  });
};

module.exports.FetchOrderAddress = async function (req, res) {
  const { id } = req.params;
  const address = await Address.findOne({ where: { id: id } });
  return res.status(200).json({
    address,
  });
};

module.exports.FetchOrders = async function (req, res) {
  const { id } = req.params;
  const orders = await Order.findAll({ where: { userId: id } });
  return res.status(200).json({
    orders,
  });
};

module.exports.UpdateOrderAction = async function (req, res) {
  const { userId } = req.query;
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.Razorpay_key_id,
      key_secret: process.env.Razorpay_key_secret,
    });
    // const orders = await Order.findAll({ where: { userId: userId } });
    // const order = orders[orders.length - 1];
    const order = await Order.findOne({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });
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
          await Order.update(
            {
              paymentId: payment.items[0].id,
              status: "SUCCESS",
            },
            { where: { id: order.id } }
          );
        } else if (status == "failed") {
          await Order.update(
            {
              paymentId: payment.items[0].id,
              status: "FAILED",
            },
            { where: { id: order.id } }
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
