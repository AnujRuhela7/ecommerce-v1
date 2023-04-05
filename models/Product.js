const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },

  img: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: [true, "Enter price : "],
  },

  desc: {
    type: String,
    required: true,
  },

  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Model maps the same collection in the DB
const Product = mongoose.model("Product", productSchema);

// Finally export the model
module.exports = Product;
