const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // Create inventory for the new product
    await Inventory.create({
      product: product._id,
      stock: req.body.stock || 0,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
};
