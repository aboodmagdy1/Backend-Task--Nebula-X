const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// helper function to update the cart totals
const updateCartTotals = async (cart) => {
  let subtotal = 0;

  // Fetch all product details in parallel using Promise.all
  const productPromises = cart.items.map((item) =>
    Product.findById(item.product)
  );

  const products = await Promise.all(productPromises);

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
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // recalculate the cart totals before returning it
    await updateCartTotals(cart);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart", error });
  }
};

//@desc Display cart totals
//@route GET /api/cart/totals
// Get cart totals
const displayCartTotals = async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await updateCartTotals(cart);
    res.status(200).json({ subtotal: cart.subtotal, total: cart.total });
  } catch (error) {
    res.status(500).json({ message: "Error getting cart totals", error });
  }
};

//@desc Add to cart
//@route POST /api/cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // 1) get the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
  } catch (error) {
    console.log("Error :", error.message);
    res.status(500).json({ message: "Error add product to Cart" });
  }
};

const deleteFromCart = async function (req, res) {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // find item index
    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
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
};

const updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // find the item
    const item = cart.items.find((item) => item.product.equals(productId));
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
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
};

module.exports = {
  addToCart,
  getCart,
  deleteFromCart,
  updateQuantity,
  displayCartTotals,
};
