const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");

router.post("/products/:productid/review", async (req, res) => {
  const { productid } = req.params;

  const { comment, rating } = req.body;

  // Find the product int which you want to add review
  const product = await Product.findById(productid);

  // Adding review in DB
  let review = await Review.create({ comment, rating });

  await product.review.push(review);

  await product.save(); // To save the content of array
  res.redirect(`/products/${productid}`);
});

// Delete a review
router.delete("/products/:productid/review/:reviewid", async (req, res) => {
  const { productid, reviewid } = req.params;
  const product = await Product.findById(productid);
  const index = product.review.indexOf(`new ObjectId("` + reviewid + `")`);
  console.log(product.review);
  console.log(index);
  console.log(reviewid);
  console.log(typeof reviewid);
  if (index > -1) product.review.splice(index, 1);
  await Review.findByIdAndDelete(reviewid);

  res.redirect(`/products/${productid}`);
});

module.exports = router;
