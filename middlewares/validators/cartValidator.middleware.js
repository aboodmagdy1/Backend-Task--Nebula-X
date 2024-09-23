const { body, check } = require("express-validator");
const validationMiddleware = require("../validator.middleware");

const addToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),

  validationMiddleware,
];

const updateQuantityValidator = [
  check("productId").isMongoId().withMessage("Invalid ID format"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),

  validationMiddleware,
];

const deleteFromCartValidator = [
  check("productId").isMongoId().withMessage("Invalid ID format"),
  validationMiddleware,
];

module.exports = {
  addToCartValidator,
  updateQuantityValidator,
  deleteFromCartValidator,
};
