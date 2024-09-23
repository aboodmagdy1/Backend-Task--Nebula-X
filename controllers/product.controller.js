const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.class");
const asyncHandler = require("express-async-handler");

const handleImageUrl = (req, res, next) => {
  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;
    req.body.image = imageUrl;
  }
  next();
};

// @desc Create  product
// @route POST /api/products/
const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, quantity, image, salePrice } = req.body;

  const product = await Product.create({
    name,
    price,
    quantity,
    image,
    salePrice,
  });
  if (!product) {
    return next(new ApiError(400, " Error Creating Product"));
  }
  res.status(201).json(product);
});

// @desc update some   product fields
// @route PATCH /api/products/:id
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Only allow specific fields to be updated
  const { name, price, quantity, image, salePrice } = req.body;

  // update product
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError(404, `No product with this id : ${id}  `));
  }

  // update field and if not provided keep the old value
  product.name = name || product.name;
  product.price = price || product.price;
  product.quantity = quantity || product.quantity;
  product.image = image || product.image;
  product.salePrice = salePrice || product.salePrice;

  await product.save();
  res.status(200).json(product);
});

// @desc update all   product fields
// @route PUT  /api/products/:id
const editProduct = asyncHandler(async (req, res, next) => {
  // find product and update all fields

  const { id } = req.params;

  // Only allow specific fields to be updated
  let { name, price, quantity, image, salePrice } = req.body;
  if (salePrice == undefined) {
    salePrice = 0;
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    { name, price, quantity, image, salePrice },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(new ApiError(404, `No product with this id : ${id}  `));
  }

  res.status(200).json(updatedProduct);
});

// @desc delete   product
// @route Delete  /api/products/:id
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) {
    return next(new ApiError(404, `No product with this id : ${id}  `));
  }

  res.status(200).json({ message: "Product deleted" });
});

// @desc Get all products
// @route GET /api/products
const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc Get  product by id
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError(404, `No product with this id : ${id}  `));
  }
  res.status(200).json(product);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  editProduct,
  deleteProduct,
  handleImageUrl,
};
