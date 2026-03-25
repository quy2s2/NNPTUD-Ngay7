const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');

// get all, get inventory by ID ( có join với product)
const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add_stock ( {product, quantity} - POST tăng stock tương ứng với quantity
const addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
    if (!inventory) return res.status(404).json({ message: 'Inventory for product not found' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove_stock ( {product, quantity} - POST giảm stock tương ứng với quantity
const removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product, stock: { $gte: quantity } }, // Ensure stock >= quantity
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true }
    );
    if (!inventory) return res.status(404).json({ message: 'Insufficient stock or product not found' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// reservation : post ( {product, quantity} - POST giảm stock và tăng reserved tương ứng với quantity
const reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product, stock: { $gte: quantity } }, // Ensure stock >= quantity
      { $inc: { stock: -quantity, reserved: quantity } },
      { new: true, runValidators: true }
    );
    if (!inventory) return res.status(404).json({ message: 'Insufficient stock or product not found' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// sold : post ( {product, quantity} - POST giảm reservation và tăng soldCount tương ứng với quantity
const sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { product, reserved: { $gte: quantity } }, // Ensure reserved >= quantity
      { $inc: { reserved: -quantity, soldCount: quantity } },
      { new: true, runValidators: true }
    );
    if (!inventory) return res.status(404).json({ message: 'Insufficient reserved items or product not found' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllInventories,
  getInventoryById,
  addStock,
  removeStock,
  reservation,
  sold,
};
