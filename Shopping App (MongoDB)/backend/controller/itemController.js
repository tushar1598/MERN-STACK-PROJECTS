const mongoose = require("mongoose");

module.exports.fetchItems = async function (req, res) {
  try {
    const collection = mongoose.connection.db.collection("Items");
    const data = await collection.find({}).toArray();
    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
};

module.exports.fetchItemsDetails = async function (req, res) {
  const { id } = req.params;
  const collection = mongoose.connection.db.collection("Items");
  const data = await collection.find({}).toArray();
  data.forEach((element) => {
    if (element._id == id) {
      return res.status(200).json({
        item: element,
      });
    }
  });
};

module.exports.AddToCart = async function (req, res) {
  const { _id, name, image, description, price, cart } = req.body.Items;
  const collection = mongoose.connection.db.collection("carts");
  const result = await collection.insertOne({
    name,
    image,
    description,
    price,
    cart,
    itemId: _id,
    userId: req.body.data._id,
  });
  return res.status(200).json({
    message: "Data inserted successfully",
    data: result,
  });
};

module.exports.RemoveFromCart = async function (req, res) {
  const { id, userId } = req.query;
  const collection = mongoose.connection.db.collection("carts");
  const removed = await collection.deleteOne({ itemId: id, userId: userId });
  return res.status(200).json({
    removed,
  });
};

module.exports.CheckItemCart = async function (req, res) {
  const { id, userId } = req.query;
  const collection = mongoose.connection.db.collection("carts");
  const data = await collection.find({}).toArray();
  data.forEach((element) => {
    if (element.itemId == id && element.userId == userId) {
      return res.status(200).json({
        item: "already",
      });
    }
  });
};
