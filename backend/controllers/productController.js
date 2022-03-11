const asyncHandler = require("express-async-handler");
// All the functions will be async, because when we interact with the DB, we get a promise
// We'll handle the promises via async-await
// We'd then have to use try-catches, but we'll instead use our own errorHandler
// To do the above, we'll use a package called 'express-async-handler'

const Product = require("../models/productModel");

// @desc    Get all Products
// @route   GET /api/products
// @acess   Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res.status(200).json(products);
});

// @desc    Create a Product
// @route   POST /api/products
// @acess   Private
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a name field!");
  }

  const product = await Product.create({
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
  });

  res.status(200).json(product);
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @acess   Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedProduct);
});

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @acess   Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  await product.remove();

  res.status(200).json({ id: req.params.id });
});

// NOTE: make sure 'exports' is plural
module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
