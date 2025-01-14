const mongoose = require("mongoose");

const transectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dateOfSale: {
      type: Date,
      required: true,
    },
    sold: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transection = mongoose.model("Transection", transectionSchema);
module.exports = Transection;
