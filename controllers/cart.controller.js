const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.class");
const asyncHandler = require("express-async-handler");

// helper function to update the cart totals
const updateCartTotals = async (cart) => {
  let subtotal = 0;

  // Baatch Query : get all products in one query
  const productIds = cart.items.map((item) => item.product);
  const products = await Product.findById({ _id: { $in: productIds } });

  // Update the prices and subtotal
  cart.items.forEach((item, index) => {
    const product = products[index];
    const price = product.salePrice ? product.salePrice : product.price;
    item.price = price;

    subtotal += price * item.quantity;
  });

  cart.subtotal = subtotal;
  cart.total = subtotal; // if there is a discount or shipping cost, update the total accordingly

  return cart;
};

//@desc Display entir cart information
//@route GET /api/cart
// Get cart details
const getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne().populate("items.product");

  if (!cart) {
    return next(new ApiError(404, "Cart not found "));
  }

  // recalculate the cart totals before returning it
  await updateCartTotals(cart);
  res.status(200).json(cart);
});

//@desc Display cart totals
//@route GET /api/cart/totals
// Get cart totals
const displayCartTotals = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();
  if (!cart) {
    return next(new ApiError(404, "Cart not found "));
  }

  await updateCartTotals(cart);
  res.status(200).json({ subtotal: cart.subtotal, total: cart.total });
});

//@desc Add to cart
//@route POST /api/cart
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  // 1) get the product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, `No Product with id : ${productId}`));
  }

  // Use sale price if available
  const productPrice = product.salePrice ? product.salePrice : product.price;

  // 2)  assuming there is only one Cart (to avoid user managment )
  let cart = await Cart.findOne();
  // 3) if there is no cart create
  if (!cart) {
    cart = new Cart({
      items: [{ product: productId, quantity, price: productPrice }],
    });
  } else {
    //  check if the product is already in the cart
    const item = cart.items.find((item) => item.product.equals(productId));
    if (item) {
      item.quantity += quantity;
      // if the sale price updated
      item.price = productPrice;
    } else {
      cart.items.push({ product: productId, quantity, price: productPrice });
    }
  }

  // 4) Recalculate the cart subtotal
  await updateCartTotals(cart);

  // 5) Save the cart and return it
  await cart.save();

  res.status(201).json(cart);
});

const deleteFromCart = asyncHandler(async function (req, res, next) {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return next(new ApiError(404, "Cart not found "));
    }

    // find item index
    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (itemIndex === -1) {
      return next(
        new ApiError(404, `No Product in the cart with  id : ${productId}`)
      );
    }

    // remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate the cart totals
    await updateCartTotals(cart);

    // Save the cart and return it
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting cart item", error });
  }
});

const updateQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return next(new ApiError(404, "Cart not found "));
    }

    // find the item
    const item = cart.items.find((item) => item.product.equals(productId));
    if (!item) {
      return next(
        new ApiError(404, `No Product in the cart with  id : ${productId}`)
      );
    }

    // update the quantity
    item.quantity = quantity;

    // Recalculate the cart totals
    await updateCartTotals(cart);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart item quantity", error });
  }
});

module.exports = {
  addToCart,
  getCart,
  deleteFromCart,
  updateQuantity,
  displayCartTotals,
};
