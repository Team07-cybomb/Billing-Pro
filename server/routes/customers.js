import express from 'express';
import Customer from '../models/Customer.js';
import { auth } from '../middleware/auth.js';
import pkg from 'csv-writer';
const createObjectCsvStringifier = pkg.createObjectCsvStringifier;

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export customers to CSV
router.get('/export', auth, async (req, res) => {
  try {
    const customers = await Customer.find();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'address', title: 'Address' }
      ]
    });

    const records = customers.map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: `${customer.address?.street || ''} ${customer.address?.city || ''}`
    }));

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;