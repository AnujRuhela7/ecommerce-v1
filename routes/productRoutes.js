const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Get All the Products
router.get("/products", async (req, res) => {
  const products = await Product.find({}); // Returns all the prodcucts
  res.render("./products/product", { products });
});

// Get form to create a new product
router.get("/products/new", async (req, res) => {
  res.render("./products/new");
});

// Create a new product
router.post("/products", async (req, res) => {
  const { name, img, desc, price } = req.body;
  await Product.create({ name, img, desc, price });
  res.redirect("/products");
});

// Show a single product
router.get("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  const product = await Product.findById(productid).populate("review");
  res.render("./products/show", { product });
});

router.post("/products", async (req, res) => {
  const { name, img, desc, price } = req.body; // Data is destructured from the submitted form, and we get the data from req.body when we submit a form
  await Product.create({ name, img, desc, price }); // create method adds the fields in the db
  res.redirect("/products");
});

//  Get the edit form
router.get("/products/:productid/edit", async (req, res) => {
  const { productid } = req.params;

  const product = await Product.findById(productid);

  res.render("./products/edit", { product });
});

// Update a product
router.patch("/products/:productid", async (req, res) => {
  const { name, img, price, desc } = req.body;

  const { productid } = req.params;

  await Product.findByIdAndUpdate(productid, { name, img, price, desc });

  res.redirect(`/products/${productid}`);
});

// Delete a product
router.delete("/products/:productid", async (req, res) => {
  const { productid } = req.params;

  await Product.findByIdAndDelete(productid);

  res.redirect("/products");
});

module.exports = router;
