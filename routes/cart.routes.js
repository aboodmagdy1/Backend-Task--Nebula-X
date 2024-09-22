const express = require("express");
const {
  addToCart,
  getCart,
  deleteFromCart,
  updateQuantity,
  displayCartTotals,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", getCart);
router.get("/totals", displayCartTotals);
router.post("/", addToCart);
router.delete("/:productId", deleteFromCart);
router.patch("/:productId", updateQuantity);

module.exports = router;
