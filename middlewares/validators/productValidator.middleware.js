const { body, check } = require("express-validator");
const validationMiddleware = require("../validator.middleware");

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),

  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number"),

  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),

  body("image")
    .notEmpty()
    .withMessage("image is required")
    .isString()
    .withMessage("image must be a string"),

  body("salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("Sale price must be lower than the price");
      }
      return true;
    }),

  validationMiddleware,
];

// update some fields
const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"), // for the id

  body("name").optional().isString().withMessage("name must be a string"),

  body("price").optional().isNumeric().withMessage("price must be a number"),

  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("quantity must be a number"),

  body("image").optional().isString().withMessage("image must be a string"),

  body("salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number")
    .custom((value, { req }) => {
      if (req.body.price !== undefined && value > +req.body.price) {
        throw new Error("Sale price must be lower than the price");
      }
      return true;
    }),

  validationMiddleware,
];

// update all fields
const editProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"), // for the id

  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),

  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number"),

  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),

  body("image")
    .notEmpty()
    .withMessage("image is required")
    .isString()
    .withMessage("image must be a string"),

  body("salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number")
    .custom((value, { req }) => {
      if (value > +req.body.price) {
        throw new Error("Sale price must be lower than the price");
      }
      return true;
    }),

  validationMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"), // for the id
  validationMiddleware,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  editProductValidator,
  deleteProductValidator,
};
