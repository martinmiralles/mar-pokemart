const asyncHandler = require("express-async-handler");
// All the functions will be async, because when we interact with the DB, we get a promise
// We'll handle the promises via async-await
// We'd then have to use try-catches, but we'll instead use our own errorHandler
// To do the above, we'll use a package called 'express-async-handler'

// @desc    Get all Products
// @route   GET /api/products
// @acess   Private
const getProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "GET Products" });
});

// @desc    Create a Product
// @route   POST /api/products
// @acess   Private
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field!");
  }

  res.status(200).json({ message: "Product created!" });
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @acess   Private
const updateProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `PUT (Update) Product: ${req.params.id}` });
});

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @acess   Private
const deleteProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `DELETE Product: ${req.params.id}` });
});

// NOTE: make sure 'exports' is plural
module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
