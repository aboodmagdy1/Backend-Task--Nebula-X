const express = require("express");
const { uploadSingleImage } = require("../Middlewares/uploadImage.middleware");

const {
  getProducts,
  getProduct,
  createProduct,
  handleImageUrl,
  updateProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  createProductValidator,
  updateProductValidator,
  editProductValidator,
  deleteProductValidator,
} = require("../Middlewares/validators/productValidator.middleware");
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post(
  "/",
  uploadSingleImage("image"),
  handleImageUrl,
  createProductValidator,
  createProduct
);
router.patch(
  "/:id",
  uploadSingleImage("image"),
  handleImageUrl,
  updateProductValidator,
  updateProduct
);
router.put(
  "/:id",
  uploadSingleImage("image"),
  handleImageUrl,
  editProductValidator,
  editProduct
);
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;
