import express from 'express';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';
import pkg from 'csv-writer';
const createObjectCsvStringifier = pkg.createObjectCsvStringifier;

const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export products to CSV
router.get('/export', auth, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Product Name' },
        { id: 'sku', title: 'SKU' },
        { id: 'price', title: 'Price' },
        { id: 'category', title: 'Category' }
      ]
    });

    const records = products.map(product => ({
      name: product.name,
      sku: product.sku,
      price: product.price,
      category: product.category
    }));

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;