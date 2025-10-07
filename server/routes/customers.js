// routes/customers.js
import express from 'express';
import Customer from '../models/Customer.js';
import { auth } from '../middleware/auth.js';
import pkg from 'csv-writer';
const createObjectCsvStringifier = pkg.createObjectCsvStringifier;

const router = express.Router();

// Helper function to normalize phone number
const normalizePhone = (phone) => phone.replace(/[^\d]/g, '');

// Helper function to check duplicate customer (FIXED: BusinessName removed from uniqueness check)
const checkDuplicateCustomer = async (phone, email, businessName, excludeId = null) => {
  const normalizedPhone = normalizePhone(phone);
  
  // 1. Check for duplicate Phone or Email
  let filter = { 
    $or: [
      { phone: normalizedPhone }
    ]
  };

  if (email && email.trim()) {
      filter.$or.push({ email: email.toLowerCase().trim() });
  }

  // NOTE: Business Name check is removed from uniqueness logic to allow multiple contacts from the same organization.

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  // We only check for phone and email duplicates now
  const existingCustomer = await Customer.findOne(filter);
  
  if (existingCustomer) {
    let type = existingCustomer.phone === normalizedPhone ? 'phone' : existingCustomer.email === email?.toLowerCase().trim() ? 'email' : 'contact detail';
    
    return { 
      exists: true, 
      type: type, 
      customer: existingCustomer,
      message: `Customer with duplicate ${type} already exists: ${existingCustomer.name} (${existingCustomer.businessName || 'Individual'})`
    };
  }

  return { exists: false };
};

// Get all customers with search and filtering (Updated to search businessName)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { businessName: { $regex: search, $options: 'i' } }, // <-- SEARCH FIELD REMAINS
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { gstNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    
    // NOTE: Invoice count remains temporary unless you implement aggregation
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

// Search customer by phone OR business name (Updated)
router.get('/search', auth, async (req, res) => {
  try {
    const { phone, businessName } = req.query;
    
    let filter = {};
    if (phone) {
      filter.phone = phone;
    }
    if (businessName) {
      filter.businessName = { $regex: businessName, $options: 'i' };
    }

    if (!phone && !businessName) {
      return res.status(400).json({ message: 'Phone number or Business Name is required for search.' });
    }

    // Use $or to find by either phone or businessName
    const customer = await Customer.findOne({ $or: [
      ...(phone ? [{ phone: normalizePhone(phone) }] : []),
      ...(businessName ? [{ businessName: { $regex: businessName, $options: 'i' } }] : [])
    ]});
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error searching customer:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create customer (Updated for duplicate check)
router.post('/', auth, async (req, res) => {
  try {
    const { phone, email, businessName } = req.body;
    
    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check for duplicates
    const duplicateCheck = await checkDuplicateCustomer(phone, email, businessName);
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

// Update customer (Updated for duplicate check)
router.put('/:id', auth, async (req, res) => {
  try {
    const { phone, email, businessName } = req.body;
    const customerId = req.params.id;

    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check for duplicates excluding current customer
    const duplicateCheck = await checkDuplicateCustomer(phone, email, businessName, customerId);
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

// Delete customer (Existing)
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

// Get single customer (Existing)
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

// Export customers to CSV (Updated to include businessName)
router.get('/export/csv', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Contact Name' },
        { id: 'businessName', title: 'Business Name' }, // <-- NEW HEADER
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'gstNumber', title: 'GST Number' },
        { id: 'address', title: 'Address' },
        { id: 'createdAt', title: 'Created Date' }
      ]
    });

    const records = customers.map(customer => ({
      name: customer.name,
      businessName: customer.businessName || 'N/A', // <-- NEW FIELD
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