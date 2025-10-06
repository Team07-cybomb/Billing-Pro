import express from 'express';
import Customer from '../models/Customer.js';
import { auth } from '../middleware/auth.js';
import pkg from 'csv-writer';
const createObjectCsvStringifier = pkg.createObjectCsvStringifier;

const router = express.Router();

// Helper function to normalize phone number
const normalizePhone = (phone) => phone.replace(/[^\d]/g, '');

// Helper function to check duplicate customer
const checkDuplicateCustomer = async (phone, email, excludeId = null) => {
  const normalizedPhone = normalizePhone(phone);
  const filter = { 
    $or: [
      { phone: { $regex: normalizedPhone, $options: 'i' } },
      { phone: { $regex: phone, $options: 'i' } }
    ]
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  const existingPhoneCustomer = await Customer.findOne(filter);
  
  if (existingPhoneCustomer) {
    return { 
      exists: true, 
      type: 'phone', 
      customer: existingPhoneCustomer,
      message: `Customer with phone number ${phone} already exists (${existingPhoneCustomer.name})`
    };
  }

  if (email && email.trim()) {
    const emailFilter = { email: email.toLowerCase().trim() };
    if (excludeId) {
      emailFilter._id = { $ne: excludeId };
    }

    const existingEmailCustomer = await Customer.findOne(emailFilter);
    
    if (existingEmailCustomer) {
      return { 
        exists: true, 
        type: 'email', 
        customer: existingEmailCustomer,
        message: `Customer with email ${email} already exists (${existingEmailCustomer.name})`
      };
    }
  }

  return { exists: false };
};

// Get all customers with search and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { gstNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    
    // Add invoice count as 0 for all customers (temporary)
    const customersWithCounts = customers.map(customer => ({
      ...customer.toObject(),
      invoiceCount: 0
    }));
    
    res.json(customersWithCounts);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search customer by phone
router.get('/search', auth, async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const customer = await Customer.findOne({ phone });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error searching customer:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const { phone, email } = req.body;
    
    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check for duplicates
    const duplicateCheck = await checkDuplicateCustomer(phone, email);
    if (duplicateCheck.exists) {
      return res.status(400).json({ message: duplicateCheck.message });
    }

    const customer = new Customer({
      ...req.body,
      phone: normalizePhone(phone),
      email: email?.toLowerCase().trim()
    });
    
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const { phone, email } = req.body;
    const customerId = req.params.id;

    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check for duplicates excluding current customer
    const duplicateCheck = await checkDuplicateCustomer(phone, email, customerId);
    if (duplicateCheck.exists) {
      return res.status(400).json({ message: duplicateCheck.message });
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        ...req.body,
        phone: normalizePhone(phone),
        email: email?.toLowerCase().trim()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ 
      message: 'Customer deleted successfully',
      deletedCustomer: customer 
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: error.message });
  }
});

// Export customers to CSV
router.get('/export/csv', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'gstNumber', title: 'GST Number' },
        { id: 'address', title: 'Address' },
        { id: 'createdAt', title: 'Created Date' }
      ]
    });

    const records = customers.map(customer => ({
      name: customer.name,
      email: customer.email || 'N/A',
      phone: customer.phone,
      gstNumber: customer.gstNumber || 'N/A',
      address: `${customer.address?.street || ''} ${customer.address?.city || ''} ${customer.address?.state || ''} ${customer.address?.zipCode || ''}`.trim(),
      createdAt: customer.createdAt?.toISOString().split('T')[0] || 'N/A'
    }));

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csvString);
  } catch (error) {
    console.error('Error exporting customers:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;