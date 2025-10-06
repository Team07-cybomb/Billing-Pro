import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Modal, Form, Badge, Dropdown, Alert, InputGroup } from 'react-bootstrap';
import { Plus, Download, MoreVertical, Eye, Printer, Edit, FileText, Search, X, UserPlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [taxDetails, setTaxDetails] = useState({
    cgst: 9,
    sgst: 9,
    igst: 0,
    gstType: 'cgst_sgst'
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [paymentType, setPaymentType] = useState('cash');

  const paymentTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' }
  ];

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const invoicesData = response.data.invoices || response.data;
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showAlert('Error fetching invoices', 'danger');
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Error fetching customers', 'danger');
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Error fetching products', 'danger');
    }
  };

  const handleCustomerSearch = async () => {
    if (!customerSearch.trim()) {
      showAlert('Please enter a mobile number', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/customers/search?phone=${customerSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setSearchedCustomer(response.data);
        setSelectedCustomer(response.data._id);
        setNewCustomer({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email || '',
          address: response.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          }
        });
        showAlert('Customer found!', 'success');
      } else {
        setSearchedCustomer(null);
        setSelectedCustomer(null);
        setNewCustomer({
          ...newCustomer,
          phone: customerSearch
        });
        showAlert('Customer not found. Please add details to create new customer.', 'info');
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      setSearchedCustomer(null);
      setSelectedCustomer(null);
      setNewCustomer({
        ...newCustomer,
        phone: customerSearch
      });
      showAlert('Customer not found. Please add details to create new customer.', 'info');
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/invoices/export', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('Invoices exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting invoices:', error);
      showAlert('Error exporting invoices', 'danger');
    }
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      showAlert('Generating PDF...', 'info');
      
      const invoice = invoices.find(inv => inv._id === invoiceId);
      if (!invoice) {
        showAlert('Invoice not found', 'danger');
        return;
      }

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .total-row { font-weight: bold; background-color: #f8f9fa; }
              .text-right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>TAX INVOICE</h1>
              <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <h3>Bill From:</h3>
                  <p><strong>Your Company Name</strong></p>
                  <p>Your Business Address</p>
                  <p>City, State - ZIP Code</p>
                  <p>GSTIN: YOUR-GST-NUMBER</p>
                </div>
                <div>
                  <h3>Bill To:</h3>
                  <p><strong>${invoice.customer?.name || 'N/A'}</strong></p>
                  <p>${invoice.customer?.phone || 'N/A'}</p>
                  <p>${invoice.customer?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div class="section">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price (₹)</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items?.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.description || `Item ${index + 1}`}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.price?.toFixed(2)}</td>
                      <td>₹${(item.quantity * item.price)?.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <table style="width: 50%; margin-left: auto;">
                <tbody>
                  <tr>
                    <td><strong>Subtotal</strong></td>
                    <td class="text-right">₹${invoice.subtotal?.toFixed(2)}</td>
                  </tr>
                  ${invoice.taxDetails?.gstType === 'cgst_sgst' ? `
                    <tr>
                      <td>CGST (${invoice.taxDetails?.cgst}%)</td>
                      <td class="text-right">₹${invoice.taxDetails?.cgstAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>SGST (${invoice.taxDetails?.sgst}%)</td>
                      <td class="text-right">₹${invoice.taxDetails?.sgstAmount?.toFixed(2)}</td>
                    </tr>
                  ` : `
                    <tr>
                      <td>IGST (${invoice.taxDetails?.igst}%)</td>
                      <td class="text-right">₹${invoice.taxDetails?.igstAmount?.toFixed(2)}</td>
                    </tr>
                  `}
                  <tr class="total-row">
                    <td><strong>Total</strong></td>
                    <td class="text-right"><strong>₹${invoice.total?.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            ${invoice.notes ? `
            <div class="section">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
            ` : ''}

            <div class="section">
              <p><strong>Payment Type:</strong> ${invoice.paymentType?.toUpperCase() || 'CASH'} | 
              <strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()} | 
              <strong> Status:</strong> ${invoice.status?.toUpperCase()}</p>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      showAlert('PDF ready for printing', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showAlert('Error generating PDF', 'danger');
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setSelectedCustomer(invoice.customer?._id || invoice.customer);
    setInvoiceItems(invoice.items || []);
    setTaxDetails(invoice.taxDetails || {
      cgst: 9,
      sgst: 9,
      igst: 0,
      gstType: 'cgst_sgst'
    });
    setNotes(invoice.notes || '');
    setDueDate(invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '');
    setPaymentType(invoice.paymentType || 'cash');
    setShowEditModal(true);
  };

  const handleUpdateInvoice = async () => {
    try {
      if (!selectedCustomer || invoiceItems.length === 0 || !dueDate) {
        showAlert('Please fill all required fields', 'warning');
        return;
      }

      const { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total } = calculateTotals();
      
      const invoiceData = {
        customer: selectedCustomer,
        items: invoiceItems.map(item => ({
          product: item.product,
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.taxRate,
          total: item.quantity * item.price
        })),
        subtotal,
        taxDetails: {
          ...taxDetails,
          cgstAmount,
          sgstAmount,
          igstAmount,
          totalTax
        },
        total,
        dueDate,
        notes,
        paymentType
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/invoices/${editingInvoice._id}`,
        invoiceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchInvoices();
      showAlert('Invoice updated successfully!', 'success');
      setShowEditModal(false);
      resetForm();
      
    } catch (error) {
      console.error('Error updating invoice:', error);
      const errorMessage = error.response?.data?.message || 'Error updating invoice';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchInvoices();
      showAlert('Invoice deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showAlert('Error deleting invoice', 'danger');
    }
  };

  const handleCreateCustomer = async () => {
    try {
      if (!newCustomer.name || !newCustomer.phone) {
        showAlert('Please enter customer name and mobile number', 'warning');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/customers', newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCustomers([...customers, response.data]);
      setSelectedCustomer(response.data._id);
      setSearchedCustomer(response.data);
      setShowCustomerForm(false);
      setCustomerSearch('');
      showAlert('Customer created successfully', 'success');
    } catch (error) {
      console.error('Error creating customer:', error);
      showAlert('Error creating customer', 'danger');
    }
  };

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { 
      product: '', 
      description: '',
      quantity: 1, 
      price: 0, 
      taxRate: 0,
      hsnCode: ''
    }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    
    if (field === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
        newItems[index].description = selectedProduct.description || selectedProduct.name;
        newItems[index].hsnCode = selectedProduct.hsnCode || '';
        newItems[index].taxRate = selectedProduct.taxRate || taxDetails.cgst + taxDetails.sgst;
      }
    }
    
    setInvoiceItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let totalTax = 0;

    if (taxDetails.gstType === 'cgst_sgst') {
      cgstAmount = subtotal * (taxDetails.cgst / 100);
      sgstAmount = subtotal * (taxDetails.sgst / 100);
      totalTax = cgstAmount + sgstAmount;
    } else {
      igstAmount = subtotal * (taxDetails.igst / 100);
      totalTax = igstAmount;
    }

    const total = subtotal + totalTax;
    
    return { 
      subtotal, 
      cgstAmount, 
      sgstAmount, 
      igstAmount, 
      totalTax, 
      total 
    };
  };

  const handleCreateInvoice = async () => {
    try {
      if (!selectedCustomer) {
        showAlert('Please select or create a customer', 'warning');
        return;
      }

      if (invoiceItems.length === 0) {
        showAlert('Please add at least one item', 'warning');
        return;
      }

      if (!dueDate) {
        showAlert('Please select a due date', 'warning');
        return;
      }

      if (!user || !user._id) {
        showAlert('User not authenticated. Please login again.', 'danger');
        return;
      }

      const { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total } = calculateTotals();
      
      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`,
        customer: selectedCustomer,
        items: invoiceItems.map(item => ({
          product: item.product,
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.taxRate,
          total: item.quantity * item.price
        })),
        subtotal,
        taxDetails: {
          ...taxDetails,
          cgstAmount,
          sgstAmount,
          igstAmount,
          totalTax
        },
        total,
        dueDate,
        notes,
        paymentType,
        status: 'draft',
        createdBy: user._id
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/invoices', invoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchInvoices();
      showAlert('Invoice created successfully!', 'success');
      setShowModal(false);
      resetForm();
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      const errorMessage = error.response?.data?.message || 'Error creating invoice';
      showAlert(errorMessage, 'danger');
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setInvoiceItems([]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
    setTaxDetails({
      cgst: 9,
      sgst: 9,
      igst: 0,
      gstType: 'cgst_sgst'
    });
    setShowCustomerForm(false);
    setNotes('');
    setDueDate('');
    setEditingInvoice(null);
    setCustomerSearch('');
    setSearchedCustomer(null);
    setPaymentType('cash');
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  }).filter(invoice => 
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.phone?.includes(searchTerm)
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total } = calculateTotals();

  // Edit Invoice Modal
  const EditInvoiceModal = () => {
    if (!editingInvoice) return null;

    return (
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetForm(); }} size="xl" centered scrollable>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Edit Invoice - #{editingInvoice.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Form>
            {/* Customer Search */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Mobile Number *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="tel"
                      placeholder="Enter customer mobile number"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomerSearch();
                        }
                      }}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={handleCustomerSearch}
                      disabled={!customerSearch.trim()}
                    >
                      <Search size={16} />
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Enter mobile number to search existing customer
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Type *</Form.Label>
                  <Form.Select 
                    value={paymentType} 
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                  >
                    {paymentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Customer Details Form */}
            {(customerSearch && !searchedCustomer) || showCustomerForm ? (
              <Row className="mb-3">
                <Col md={12}>
                  <Card className="border">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          {searchedCustomer ? 'Customer Found' : 'Add New Customer'}
                        </h6>
                        <Button variant="link" size="sm" onClick={() => {
                          setShowCustomerForm(false);
                          setCustomerSearch('');
                          setSearchedCustomer(null);
                        }}>
                          <X size={16} />
                        </Button>
                      </div>
                      
                      {searchedCustomer ? (
                        <div className="p-3 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: '40px', height: '40px' }}>
                              <span className="text-white fw-bold">
                                {searchedCustomer.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                            <div>
                              <div className="fw-semibold">{searchedCustomer.name}</div>
                              <div className="text-muted">{searchedCustomer.phone}</div>
                              {searchedCustomer.email && (
                                <div className="text-muted small">{searchedCustomer.email}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label>Customer Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                placeholder="Enter customer name"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label>Mobile Number *</Form.Label>
                              <Form.Control
                                type="tel"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                placeholder="Mobile number"
                                required
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group className="mb-2">
                              <Form.Label>Email (Optional)</Form.Label>
                              <Form.Control
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                placeholder="Email address"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Button 
                              variant="primary" 
                              onClick={handleCreateCustomer}
                              disabled={!newCustomer.name || !newCustomer.phone}
                            >
                              Create Customer
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : null}

            {/* Due Date */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date *</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tax Details */}
            <Row className="mb-3">
              <Col md={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Tax Configuration</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>GST Type</Form.Label>
                          <Form.Select
                            value={taxDetails.gstType}
                            onChange={(e) => setTaxDetails({...taxDetails, gstType: e.target.value})}
                          >
                            <option value="cgst_sgst">CGST + SGST</option>
                            <option value="igst">IGST</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      {taxDetails.gstType === 'cgst_sgst' ? (
                        <>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>CGST Rate (%)</Form.Label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                value={taxDetails.cgst}
                                onChange={(e) => setTaxDetails({...taxDetails, cgst: parseFloat(e.target.value)})}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>SGST Rate (%)</Form.Label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                value={taxDetails.sgst}
                                onChange={(e) => setTaxDetails({...taxDetails, sgst: parseFloat(e.target.value)})}
                              />
                            </Form.Group>
                          </Col>
                        </>
                      ) : (
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>IGST Rate (%)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              value={taxDetails.igst}
                              onChange={(e) => setTaxDetails({...taxDetails, igst: parseFloat(e.target.value)})}
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Invoice Items */}
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Invoice Items *</Form.Label>
                <Button variant="outline-primary" size="sm" onClick={handleAddItem}>
                  <Plus size={16} className="me-1" />
                  Add Item
                </Button>
              </div>
              
              {invoiceItems.length > 0 ? (
                <Card className="border">
                  <Card.Body className="p-0">
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Product</th>
                          <th>Description</th>
                          <th>HSN Code</th>
                          <th>Qty</th>
                          <th>Price (₹)</th>
                          <th>Tax %</th>
                          <th>Total (₹)</th>
                          <th width="50"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Form.Select
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                required
                              >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                  <option key={product._id} value={product._id}>
                                    {product.name} - ₹{product.price}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                placeholder="Item description"
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.hsnCode}
                                onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                                placeholder="HSN Code"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.taxRate}
                                onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                              />
                            </td>
                            <td className="fw-semibold">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <X size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="border">
                  <Card.Body>
                    <div className="text-center text-muted py-4">
                      <Plus size={32} className="mb-2" />
                      <div>Add items to this invoice</div>
                      <small className="text-muted">Click "Add Item" to start</small>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Form.Group>

            {/* Summary Section */}
            {invoiceItems.length > 0 && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Additional notes..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Invoice Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {taxDetails.gstType === 'cgst_sgst' ? (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span>CGST ({taxDetails.cgst}%):</span>
                            <span>₹{cgstAmount.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>SGST ({taxDetails.sgst}%):</span>
                            <span>₹{sgstAmount.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-between mb-2">
                          <span>IGST ({taxDetails.igst}%):</span>
                          <span>₹{igstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => { setShowEditModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleUpdateInvoice}
            disabled={!selectedCustomer || invoiceItems.length === 0 || !dueDate}
          >
            Update Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Print Invoice Preview Component
  const PrintInvoicePreview = () => {
    if (!currentInvoice) return null;

    const customer = customers.find(c => c._id === currentInvoice.customer) || currentInvoice.customer;

    return (
      <Modal show={showInvoicePreview} onHide={() => setShowInvoicePreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice Preview - #{currentInvoice.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <div className="text-center mb-4">
              <h2>TAX INVOICE</h2>
              <p><strong>Invoice #:</strong> {currentInvoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {new Date(currentInvoice.createdAt).toLocaleDateString()}</p>
            </div>
            
            <Row className="mb-4">
              <Col md={6}>
                <h5>Bill From:</h5>
                <p><strong>Your Company Name</strong></p>
                <p>Your Business Address</p>
                <p>City, State - ZIP Code</p>
              </Col>
              <Col md={6}>
                <h5>Bill To:</h5>
                <p><strong>{customer?.name || 'N/A'}</strong></p>
                <p>{customer?.phone || 'N/A'}</p>
                <p>{customer?.email || 'N/A'}</p>
              </Col>
            </Row>

            <Table responsive className="mb-4">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.description || `Item ${index + 1}`}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price?.toFixed(2)}</td>
                    <td>₹{(item.quantity * item.price)?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Table>
                  <tbody>
                    <tr>
                      <td><strong>Subtotal</strong></td>
                      <td className="text-end">₹{currentInvoice.subtotal?.toFixed(2)}</td>
                    </tr>
                    {currentInvoice.taxDetails?.gstType === 'cgst_sgst' ? (
                      <>
                        <tr>
                          <td>CGST ({currentInvoice.taxDetails?.cgst}%)</td>
                          <td className="text-end">₹{currentInvoice.taxDetails?.cgstAmount?.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>SGST ({currentInvoice.taxDetails?.sgst}%)</td>
                          <td className="text-end">₹{currentInvoice.taxDetails?.sgstAmount?.toFixed(2)}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td>IGST ({currentInvoice.taxDetails?.igst}%)</td>
                        <td className="text-end">₹{currentInvoice.taxDetails?.igstAmount?.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="fw-bold">
                      <td>Total</td>
                      <td className="text-end">₹{currentInvoice.total?.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            {currentInvoice.notes && (
              <div className="mt-4">
                <h6>Notes:</h6>
                <p>{currentInvoice.notes}</p>
              </div>
            )}

            <div className="mt-4">
              <p>
                <strong>Payment Type:</strong> {currentInvoice.paymentType?.toUpperCase() || 'CASH'} | 
                <strong> Due Date:</strong> {new Date(currentInvoice.dueDate).toLocaleDateString()} | 
                <strong> Status:</strong> {currentInvoice.status?.toUpperCase()}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowInvoicePreview(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer size={16} className="me-2" />
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="p-4">
      {alert.show && (
        <Alert variant={alert.type} className="mb-3" dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
          {alert.message}
        </Alert>
      )}
      
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Invoices</h2>
          <p className="text-muted mb-0">Create and manage customer invoices</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-primary" className="d-flex align-items-center" onClick={handleExportCSV}>
            <Download size={18} className="me-2" />
            Export CSV
          </Button>
          <Button variant="success" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            New Invoice
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border-0 bg-light"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No invoices found</h5>
              <p className="text-muted">Create your first invoice to get started</p>
              <Button variant="success" onClick={() => setShowModal(true)}>
                <Plus size={18} className="me-2" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>GST Type</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(invoice => (
                  <tr key={invoice._id}>
                    <td className="fw-semibold">
                      <div className="d-flex align-items-center">
                        <FileText size={16} className="text-primary me-2" />
                        #{invoice.invoiceNumber}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                          <span className="text-white fw-bold small">
                            {invoice.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div>
                          <div className="fw-semibold">{invoice.customer?.name || 'Unknown Customer'}</div>
                          <small className="text-muted">{invoice.customer?.email || 'No email'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{invoice.customer?.phone || 'N/A'}</td>
                    <td className="fw-semibold">₹{invoice.total?.toFixed(2)}</td>
                    <td>
                      <Badge bg="secondary" className="text-uppercase">
                        {invoice.paymentType || 'cash'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info" className="text-uppercase">
                        {invoice.taxDetails?.gstType === 'cgst_sgst' ? 'CGST+SGST' : 'IGST'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(invoice.status)} className="rounded-pill">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="text-muted">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-muted">
                      {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" className="border-0">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => { setCurrentInvoice(invoice); setShowInvoicePreview(true); }}>
                            <Eye size={16} className="me-2" />
                            View
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditInvoice(invoice)}>
                            <Edit size={16} className="me-2" />
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDownloadPDF(invoice._id)}>
                            <Download size={16} className="me-2" />
                            Download PDF
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => window.print()}>
                            <Printer size={16} className="me-2" />
                            Print
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="text-danger" 
                            onClick={() => handleDeleteInvoice(invoice._id)}
                          >
                            <Trash2 size={16} className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Invoice Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="xl" centered scrollable>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Create New Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Form>
            {/* Customer Search */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Mobile Number *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="tel"
                      placeholder="Enter customer mobile number"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomerSearch();
                        }
                      }}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={handleCustomerSearch}
                      disabled={!customerSearch.trim()}
                    >
                      <Search size={16} />
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Enter mobile number to search existing customer or create new one
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Type *</Form.Label>
                  <Form.Select 
                    value={paymentType} 
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                  >
                    {paymentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Customer Details Form */}
            {(customerSearch && !searchedCustomer) || showCustomerForm ? (
              <Row className="mb-3">
                <Col md={12}>
                  <Card className="border">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          {searchedCustomer ? 'Customer Found' : 'Add New Customer'}
                        </h6>
                        <Button variant="link" size="sm" onClick={() => {
                          setShowCustomerForm(false);
                          setCustomerSearch('');
                          setSearchedCustomer(null);
                        }}>
                          <X size={16} />
                        </Button>
                      </div>
                      
                      {searchedCustomer ? (
                        <div className="p-3 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: '40px', height: '40px' }}>
                              <span className="text-white fw-bold">
                                {searchedCustomer.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                            <div>
                              <div className="fw-semibold">{searchedCustomer.name}</div>
                              <div className="text-muted">{searchedCustomer.phone}</div>
                              {searchedCustomer.email && (
                                <div className="text-muted small">{searchedCustomer.email}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label>Customer Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                placeholder="Enter customer name"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label>Mobile Number *</Form.Label>
                              <Form.Control
                                type="tel"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                placeholder="Mobile number"
                                required
                                disabled
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group className="mb-2">
                              <Form.Label>Email (Optional)</Form.Label>
                              <Form.Control
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                placeholder="Email address"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Button 
                              variant="primary" 
                              onClick={handleCreateCustomer}
                              disabled={!newCustomer.name || !newCustomer.phone}
                            >
                              Create Customer
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : null}

            {/* Due Date */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date *</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tax Details */}
            <Row className="mb-3">
              <Col md={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Tax Configuration</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>GST Type</Form.Label>
                          <Form.Select
                            value={taxDetails.gstType}
                            onChange={(e) => setTaxDetails({...taxDetails, gstType: e.target.value})}
                          >
                            <option value="cgst_sgst">CGST + SGST</option>
                            <option value="igst">IGST</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      {taxDetails.gstType === 'cgst_sgst' ? (
                        <>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>CGST Rate (%)</Form.Label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                value={taxDetails.cgst}
                                onChange={(e) => setTaxDetails({...taxDetails, cgst: parseFloat(e.target.value)})}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>SGST Rate (%)</Form.Label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                value={taxDetails.sgst}
                                onChange={(e) => setTaxDetails({...taxDetails, sgst: parseFloat(e.target.value)})}
                              />
                            </Form.Group>
                          </Col>
                        </>
                      ) : (
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>IGST Rate (%)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              value={taxDetails.igst}
                              onChange={(e) => setTaxDetails({...taxDetails, igst: parseFloat(e.target.value)})}
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Invoice Items */}
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Invoice Items *</Form.Label>
                <Button variant="outline-primary" size="sm" onClick={handleAddItem}>
                  <Plus size={16} className="me-1" />
                  Add Item
                </Button>
              </div>
              
              {invoiceItems.length > 0 ? (
                <Card className="border">
                  <Card.Body className="p-0">
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Product</th>
                          <th>Description</th>
                          <th>HSN Code</th>
                          <th>Qty</th>
                          <th>Price (₹)</th>
                          <th>Tax %</th>
                          <th>Total (₹)</th>
                          <th width="50"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Form.Select
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                required
                              >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                  <option key={product._id} value={product._id}>
                                    {product.name} - ₹{product.price}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                placeholder="Item description"
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={item.hsnCode}
                                onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                                placeholder="HSN Code"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.taxRate}
                                onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                              />
                            </td>
                            <td className="fw-semibold">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <X size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="border">
                  <Card.Body>
                    <div className="text-center text-muted py-4">
                      <Plus size={32} className="mb-2" />
                      <div>Add items to this invoice</div>
                      <small className="text-muted">Click "Add Item" to start</small>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Form.Group>

            {/* Summary Section */}
            {invoiceItems.length > 0 && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Additional notes..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Card className="border">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Invoice Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {taxDetails.gstType === 'cgst_sgst' ? (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span>CGST ({taxDetails.cgst}%):</span>
                            <span>₹{cgstAmount.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>SGST ({taxDetails.sgst}%):</span>
                            <span>₹{sgstAmount.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-between mb-2">
                          <span>IGST ({taxDetails.igst}%):</span>
                          <span>₹{igstAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => { setShowModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleCreateInvoice}
            disabled={!selectedCustomer || invoiceItems.length === 0 || !dueDate}
          >
            Create Invoice
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Invoice Modal */}
      <EditInvoiceModal />

      {/* Invoice Preview Modal */}
      <PrintInvoicePreview />
    </div>
  );
};

export default Invoices;