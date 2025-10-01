import express from 'express';
import Invoice from '../models/Invoice.js';
import { auth } from '../middleware/auth.js';
import pkg from 'csv-writer';
const createObjectCsvStringifier = pkg.createObjectCsvStringifier;

const router = express.Router();

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer')
      .populate('createdBy')
      .populate('items.product');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create invoice
router.post('/', auth, async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    await invoice.populate('customer items.product');
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export invoices to CSV
router.get('/export', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer')
      .populate('createdBy');

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'invoiceNumber', title: 'Invoice Number' },
        { id: 'customerName', title: 'Customer Name' },
        { id: 'total', title: 'Total' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Created Date' }
      ]
    });

    const records = invoices.map(invoice => ({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer?.name || 'N/A',
      total: invoice.total,
      status: invoice.status,
      createdAt: invoice.createdAt
    }));

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;