const asyncHandler = require("express-async-handler");
// All the functions will be async, because when we interact with the DB, we get a promise
// We'll handle the promises via async-await
// We'd then have to use try-catches, but we'll instead use our own errorHandler
// To do the above, we'll use a package called 'express-async-handler'

const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc    Get all Products
// @route   GET /api/products
// @access  Public
// @TODO    *Must modify to limit the number of displayed products (refer to ProShop)
const getProducts = asyncHandler(async (req, res) => {
  // const products = await Product.find({ user: req.user.id });
  const products = await Product.find({});
  res.json(products);

  res.status(200).json(products);
});

// @desc    Fetches a single product
// @route   GET /api/products/:id
// @access  Public
// @TODO    *There may be an issue when product isn't found - the else-block doesn't trigger
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a Product
// @route   POST /api/products
// @acess   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a name field!");
  }

  const product = await Product.create({
    user: req.user.id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
  });

  res.status(201).json(product);
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @acess   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  // Check if user is associated with the product, before updating
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // match the 'user' field in the Product model matches the logged in user
  if (product.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
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

  // Check if user is associated with the product, before deleting
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // match the 'user' field in the Product model matches the logged in user
  if (product.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await product.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already given this product a review.");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// NOTE: make sure 'exports' is plural
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
  getTopProducts,
};
