const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const Product = require('./models/product.model');
const Inventory = require('./models/inventory.model');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));

// Simple diagnostic route
app.get('/', (req, res) => {
  res.send('Inventory Management API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
