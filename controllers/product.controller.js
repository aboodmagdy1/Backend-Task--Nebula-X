const Product = require("../models/product.model");

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
const createProduct = async (req, res) => {
  const { name, price, quantity, image, salePrice } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      quantity,
      image,
      salePrice,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc update some   product fields
// @route PATCH /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow specific fields to be updated
    const { name, price, quantity, image, salePrice } = req.body;

    // update product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // update field and if not provided keep the old value
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.image = image || product.image;
    product.salePrice = salePrice || product.salePrice;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc update all   product fields
// @route PUT  /api/products/:id
const editProduct = async (req, res) => {
  // find product and update all fields
  try {
    const { id } = req.params;

    // Only allow specific fields to be updated
    const { name, price, quantity, image, salePrice } = req.body;
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
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc delete   product
// @route Delete  /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Get all products
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Get  product by id
// @route GET /api/products/:id
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  editProduct,
  deleteProduct,
  handleImageUrl,
};
