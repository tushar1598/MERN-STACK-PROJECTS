const Item = require("../models/items");
const Cart = require("../models/cart");

module.exports.FetchItems = async function (req, res) {
  const items = await Item.findAll({});
  return res.status(200).json({
    items,
  });
};

module.exports.FetchItemDetails = async function (req, res) {
  const { id } = req.params;
  const item = await Item.findOne({ where: { id: id } });
  return res.status(200).json({
    item: item,
  });
};

module.exports.AddToCart = async function (req, res) {
  const { itemId, userId } = req.body;
  const item = await Item.findOne({ where: { id: itemId } });
  const cartItem = await Cart.create({
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    quantity: 1,
    total: item.price,
    image: item.image,
    itemId: item.id,
    userId: userId,
  });
  return res.status(200).json({
    cartItem,
  });
};

module.exports.CheckToCart = async function (req, res) {
  const { itemId, userId } = req.query;
  const item = await Cart.findOne({
    where: { itemId: itemId, userId: userId },
  });
  if (item) {
    return res.status(200).json({
      item: "already",
    });
  }
  return res.status(200).json({
    item,
  });
};

module.exports.RemoveToCart = async function (req, res) {
  const { itemId, userId } = req.query;
  const removed = await Cart.destroy({
    where: { itemId: itemId, userId: userId },
  });
  return res.status(200).json({
    removed,
  });
};
