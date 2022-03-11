const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// These two lines combine the initial 4 lines after it, for cleanliness
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct);

// router.get("/", getProducts);
// router.post("/", createProduct);

// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

module.exports = router;
