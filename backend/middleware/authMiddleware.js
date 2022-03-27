const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //   In the HTTP headers, we want to find the authorization object
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, BUT NOT the password
      req.user = await User.findById(decoded.id).select("-password");

      //   Call next() to the following middleware gets called
      next();
    } catch (error) {
      console.log(error);

      // 401 means: NOT AUTHORIZED
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  //   If there is no token at all
  if (!token) {
    res.status(401);
    throw new Error("Not authorized - no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};

module.exports = { protect, admin };
