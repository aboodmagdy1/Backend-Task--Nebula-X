const express = require("express");
const {
  addToCart,
  getCart,
  deleteFromCart,
  updateQuantity,
  displayCartTotals,
} = require("../controllers/cart.controller");
const {
  addToCartValidator,
  deleteFromCartValidator,
  updateQuantityValidator,
} = require("../middlewares/validators/cartValidator.middleware");

const router = express.Router();

router.get("/", getCart);
router.get("/totals", displayCartTotals);
router.post("/", addToCartValidator, addToCart);
router.patch("/:productId", updateQuantityValidator, updateQuantity);
router.delete("/:productId", deleteFromCartValidator, deleteFromCart);

module.exports = router;
