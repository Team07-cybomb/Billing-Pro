// InvoiceFrontend.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Table, Button, Card, Row, Col, Modal, Form, Badge, Dropdown, Alert, InputGroup
} from 'react-bootstrap';
import {
  Plus, Download, MoreVertical, Eye, Printer, Edit, FileText, Search, X, Trash2
} from 'lucide-react';

/**
 * InvoiceFrontend
 * - purely presentational + uses the state + actions passed via props
 */
export default function InvoiceFrontend(props) {
  const {
    invoices, customers, products,
    // form state
    selectedCustomer, setSelectedCustomer,
    invoiceItems, setInvoiceItems,
    taxDetails, setTaxDetails, 
    notes, setNotes,
    dueDate, setDueDate,
    paymentType, setPaymentType,

    // actions
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    exportInvoices,
    createCustomer,
    searchCustomerByPhone,
    addItem,
    removeItem,
    updateItem,
    calculateTotalsForItems,
    resetForm,

    alert,
    showAlert,
    user // Assuming user context is passed via props
  } = props;

  // UI-only local state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // NOTE: New state for customer form data to prevent global re-renders
  const [localCustomerPayload, setLocalCustomerPayload] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '' }
  });

  const paymentTypes = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' }
  ];

  // derived totals for current form items
  const totals = useMemo(() => calculateTotalsForItems(invoiceItems), [invoiceItems, calculateTotalsForItems]);

  // --- Sorting, Filtering, and Sequential Numbering ---
  const sortedAndFilteredInvoices = useMemo(() => {
    return invoices
      .filter(inv => {
        if (filter !== 'all' && inv.status !== filter) return false;
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        return (inv.invoiceNumber || '').toLowerCase().includes(term)
          || (inv.customer?.name || '').toLowerCase().includes(term)
          || (inv.customer?.phone || '').includes(term);
      })
      // Sort by createdAt date (oldest first)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [invoices, filter, searchTerm]);

  // Use this for the counter badge
  const filteredInvoices = sortedAndFilteredInvoices; 
  
  const getSequentialInvoiceNumber = (index) => {
      return `INV-${(index + 1).toString().padStart(4, '0')}`;
  }

  // --- Customer Handlers (Updated for local state) ---

  const handleCustomerSearch = async () => {
    if (!customerSearch.trim()) {
      showAlert('Please enter a mobile number', 'warning');
      return;
    }
    try {
      const found = await searchCustomerByPhone(customerSearch);
      if (found) {
        setSearchedCustomer(found);
        setSelectedCustomer(found._id);
        // Initialize local payload with found data
        setLocalCustomerPayload({
          name: found.name,
          email: found.email || '',
          phone: found.phone,
          address: found.address || { street: '', city: '', state: '', zipCode: '' }
        });
        showAlert('Customer found!', 'success');
        setShowCustomerForm(false);
      } else {
        setSearchedCustomer(null);
        setSelectedCustomer(null);
        // Initialize local payload for creation
        setLocalCustomerPayload(prev => ({ 
            name: '', 
            email: '', 
            phone: customerSearch, // Keep phone from search input
            address: { street: '', city: '', state: '', zipCode: '' } 
        }));
        showAlert('Customer not found. Fill details and create new customer.', 'info');
        setShowCustomerForm(true);
      }
    } catch (error) {
      showAlert('Error searching for customer', 'danger');
    }
  };

  const handleCreateCustomer = async () => {
    try {
      if (!localCustomerPayload.name || !localCustomerPayload.phone) {
        showAlert('Please enter name & phone', 'warning');
        return;
      }
      const created = await createCustomer(localCustomerPayload);
      setSelectedCustomer(created._id);
      setSearchedCustomer(created);
      setShowCustomerForm(false);
    } catch (err) {
      // createCustomer already shows alert
    }
  };
  
  // --- Product/Item Handlers ---

  const handleProductSelect = (index, productId) => {
    // IMPORTANT: Call updateItem from the backend hook, which handles populating fields
    updateItem(index, 'product', productId);
  };

  const handleItemFieldChange = (index, field, value) => {
    // IMPORTANT: Call updateItem from the backend hook
    updateItem(index, field, value);
  };


  // --- Form Logic ---
  
  const resetFormLocal = () => {
    resetForm(); 
    setSelectedCustomer(null);
    setInvoiceItems([]);
    setTaxDetails({ cgst: 9, sgst: 9, igst: 0, gstType: 'cgst_sgst' });
    setNotes('');
    setDueDate('');
    setPaymentType('cash');
    setCustomerSearch('');
    setSearchedCustomer(null);
    setShowCustomerForm(false);
    setLocalCustomerPayload({ name: '', email: '', phone: '', address: { street: '', city: '', state: '', zipCode: '' } });
  };
  
  const buildInvoicePayload = (invoiceNumber = `INV-${Date.now()}`) => {
      // Get the derived totals and taxDetails from backend hook
      const { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total, taxDetails: derivedTaxDetails } = totals;

      const invalidItems = invoiceItems.filter(item => 
        !item.product || !item.description || !item.quantity || !item.price
      );
      
      if (invalidItems.length > 0) {
        showAlert('Please fill all required fields for all items', 'warning');
        return null;
      }
      
      return {
        invoiceNumber,
        customer: selectedCustomer,
        items: invoiceItems.map(item => ({
          product: item.product,
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.taxRate,
          total: (Number(item.quantity) || 0) * (Number(item.price) || 0)
        })),
        subtotal,
        taxDetails: {
          ...derivedTaxDetails, 
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
        createdAt: new Date().toISOString(),
        createdBy: user?._id 
      };
  };

  const handleCreateInvoiceClick = async () => {
    if (!selectedCustomer || invoiceItems.length === 0 || !dueDate) {
        showAlert('Please fill all required fields', 'warning');
        return;
    }
    
    const invoicePayload = buildInvoicePayload();
    if (!invoicePayload) return;

    await createInvoice(invoicePayload);
    setShowModal(false);
    resetFormLocal();
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setSelectedCustomer(invoice.customer?._id || invoice.customer);
    setInvoiceItems(invoice.items || []);
    setTaxDetails(invoice.taxDetails || { cgst: 9, sgst: 9, igst: 0, gstType: 'cgst_sgst' }); 
    setNotes(invoice.notes || '');
    setDueDate(invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '');
    setPaymentType(invoice.paymentType || 'cash');
    setShowEditModal(true);
  };

  const handleUpdateInvoiceClick = async () => {
    if (!editingInvoice) return;
    
    const payload = buildInvoicePayload(editingInvoice.invoiceNumber);
    if (!payload) return;

    delete payload.invoiceNumber;
    delete payload.createdAt;
    delete payload.createdBy;
    delete payload.status; 

    await updateInvoice(editingInvoice._id, payload);
    setShowEditModal(false);
    resetFormLocal();
  };
  
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    await deleteInvoice(invoiceId);
  };

  const handleDownloadPDF = (invoiceId) => {
      // Logic for printing the invoice (copied from original, using current data)
      const invoice = invoices.find(inv => inv._id === invoiceId);
      // FIX: Use the customer object passed to the function or look it up explicitly
      const customer = customers.find(c => c._id === (invoice.customer?._id || invoice.customer));
      
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
                  <p><strong>${customer?.name || 'N/A'}</strong></p>
                  <p>${customer?.phone || 'N/A'}</p>
                  <p>${customer?.email || 'N/A'}</p>
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
                      <td>₹${(item.price || 0)?.toFixed(2)}</td>
                      <td>₹${((item.quantity || 0) * (item.price || 0))?.toFixed(2)}</td>
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
                      <td>CGST (${invoice.taxDetails?.cgst?.toFixed(2)}%)</td>
                      <td class="text-right">₹${invoice.taxDetails?.cgstAmount?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>SGST (${invoice.taxDetails?.sgst?.toFixed(2)}%)</td>
                      <td class="text-right">₹${invoice.taxDetails?.sgstAmount?.toFixed(2)}</td>
                    </tr>
                  ` : `
                    <tr>
                      <td>IGST (${invoice.taxDetails?.igst?.toFixed(2)}%)</td>
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
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  // The main form component for creation and editing
  const InvoiceForm = ({ isEdit = false, onSubmit, onCancel, submitButtonText = "Create Invoice" }) => (
    <Form>
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
                onKeyPress={(e) => { if (e.key === 'Enter') handleCustomerSearch(); }}
                aria-describedby="customerSearchHelp"
              />
              <Button variant="outline-primary" onClick={handleCustomerSearch} disabled={!customerSearch.trim()}>
                <Search size={16} />
              </Button>
            </InputGroup>
            <Form.Text id="customerSearchHelp" className="text-muted">
              Enter mobile number to search existing customer or create new one
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Payment Type *</Form.Label>
            <Form.Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required>
              {paymentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Customer Found / Create */}
      {(customerSearch && !searchedCustomer) || showCustomerForm ? (
        <Row className="mb-3">
          <Col md={12}>
            <Card className="border">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">{searchedCustomer ? 'Customer Found' : 'Add New Customer'}</h6>
                  <Button variant="link" size="sm" onClick={() => { setShowCustomerForm(false); setCustomerSearch(''); setSearchedCustomer(null); }}>
                    <X size={16} />
                  </Button>
                </div>

                {searchedCustomer ? (
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <span className="text-white fw-bold">{searchedCustomer.name?.charAt(0)?.toUpperCase() || 'C'}</span>
                      </div>
                      <div>
                        <div className="fw-semibold">{searchedCustomer.name}</div>
                        <div className="text-muted">{searchedCustomer.phone}</div>
                        {searchedCustomer.email && <div className="text-muted small">{searchedCustomer.email}</div>}
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
                          value={localCustomerPayload.name} 
                          // Fix: Use local state setter
                          onChange={(e) => setLocalCustomerPayload(prev => ({ ...prev, name: e.target.value }))} 
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
                          value={localCustomerPayload.phone} 
                          // Fix: Use local state setter
                          onChange={(e) => setLocalCustomerPayload(prev => ({ ...prev, phone: e.target.value }))} 
                          placeholder="Mobile number" 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label>Email (Optional)</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={localCustomerPayload.email} 
                          // Fix: Use local state setter
                          onChange={(e) => setLocalCustomerPayload(prev => ({ ...prev, email: e.target.value }))} 
                          placeholder="Email address" 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button variant="primary" onClick={handleCreateCustomer} disabled={!localCustomerPayload.name || !localCustomerPayload.phone}>
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

      {/* Invoice Items */}
      <Form.Group className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="mb-0">Invoice Items *</Form.Label>
          <Button variant="outline-primary" size="sm" onClick={addItem}>
            <Plus size={16} className="me-1" />Add Item
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
                  {invoiceItems.map((item, idx) => (
                    <tr key={`item-${idx}`}>
                      <td>
                        <Form.Select 
                          value={item.product} 
                          // FIX: Call the correct item handler
                          onChange={(e) => handleProductSelect(idx, e.target.value)} 
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.name} - ₹{p.price}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control 
                          type="text" 
                          value={item.description} 
                          onChange={(e) => handleItemFieldChange(idx, 'description', e.target.value)} 
                          placeholder="Item description" 
                          required 
                        />
                      </td>
                      <td>
                        <Form.Control 
                          type="text" 
                          value={item.hsnCode} 
                          onChange={(e) => handleItemFieldChange(idx, 'hsnCode', e.target.value)} 
                          placeholder="HSN Code" 
                        />
                      </td>
                      <td>
                        <Form.Control 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => {
                            const value = Math.max(1, parseInt(e.target.value) || 1);
                            handleItemFieldChange(idx, 'quantity', value);
                          }} 
                          required 
                        />
                      </td>
                      <td>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          value={item.price} 
                          onChange={(e) => {
                            const value = Math.max(0, parseFloat(e.target.value) || 0);
                            handleItemFieldChange(idx, 'price', value);
                          }} 
                          required 
                        />
                      </td>
                      <td>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          value={item.taxRate} 
                          onChange={(e) => handleItemFieldChange(idx, 'taxRate', parseFloat(e.target.value) || 0)} 
                        />
                      </td>
                      <td className="fw-semibold">
                        ₹{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                      </td>
                      <td>
                        <Button variant="outline-danger" size="sm" onClick={() => removeItem(idx)}>
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

      {/* Summary */}
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
              <Card.Header className="bg-light"><h6 className="mb-0">Invoice Summary</h6></Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                {/* Use derived tax details for display */}
                {totals.totalTax > 0 ? (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span>CGST ({totals.taxDetails.cgst.toFixed(2)}%):</span>
                      <span>₹{totals.cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>SGST ({totals.taxDetails.sgst.toFixed(2)}%):</span>
                      <span>₹{totals.sgstAmount.toFixed(2)}</span>
                    </div>
                  </>
                ) : null}
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onCancel}>Cancel</Button>
        <Button 
          variant={isEdit ? "warning" : "success"} 
          onClick={onSubmit} 
          disabled={!selectedCustomer || invoiceItems.length === 0 || !dueDate}
        >
          {submitButtonText}
        </Button>
      </Modal.Footer>
    </Form>
  );

  return (
    <div className="p-4">
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-3" dismissible onClose={() => showAlert('', 'hidden')}>
          {alert.message}
        </Alert>
      )}

      {/* Header and Controls */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Invoices</h2>
          <p className="text-muted mb-0">Create and manage customer invoices</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-primary" className="d-flex align-items-center" onClick={exportInvoices}>
            <Download size={18} className="me-2" /> Export CSV
          </Button>
          <Button variant="success" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" /> New Invoice
          </Button>
        </Col>
      </Row>

      {/* Invoice Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)} className="border-0 bg-light">
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
                <Plus size={18} className="me-2" /> Create Invoice
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
                {filteredInvoices.map((inv, index) => (
                  <tr key={inv._id}>
                    <td className="fw-semibold">
                      <div className="d-flex align-items-center">
                        <FileText size={16} className="text-primary me-2" />
                        <div className='d-flex flex-column'>
                            <span className='fw-bold'>#{getSequentialInvoiceNumber(index)}</span>
                            <small className="text-muted fw-normal fst-italic">{new Date(inv.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                          <span className="text-white fw-bold small">
                            {inv.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div>
                          <div className="fw-semibold">{inv.customer?.name || 'Unknown Customer'}</div>
                          <small className="text-muted">{inv.customer?.email || 'No email'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{inv.customer?.phone || 'N/A'}</td>
                    <td className="fw-semibold">₹{(inv.total || 0).toFixed(2)}</td>
                    <td>
                      <Badge bg="secondary" className="text-uppercase">
                        {inv.paymentType || 'cash'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info" className="text-uppercase">
                         {inv.taxDetails?.gstType === 'cgst_sgst' ? 'CGST+SGST' : 'IGST'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(inv.status)} className="rounded-pill">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="text-muted">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-muted">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="light" 
                          size="sm" 
                          className="border-0"
                          aria-label="Invoice actions"
                        >
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => { setCurrentInvoice({...inv, sequentialNumber: getSequentialInvoiceNumber(index)}); setShowInvoicePreview(true); }}>
                            <Eye size={16} className="me-2" />View
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditInvoice(inv)}>
                            <Edit size={16} className="me-2" />Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDownloadPDF(inv._id)}>
                            <Download size={16} className="me-2" />Download PDF
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => window.print()}>
                            <Printer size={16} className="me-2" />Print
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="text-danger" onClick={() => handleDeleteInvoice(inv._id)}>
                            <Trash2 size={16} className="me-2" />Delete
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
      <Modal 
        show={showModal} 
        onHide={() => { setShowModal(false); resetFormLocal(); }} 
        size="xl" 
        centered 
        scrollable
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Create New Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <InvoiceForm
            onSubmit={handleCreateInvoiceClick}
            onCancel={() => { setShowModal(false); resetFormLocal(); }}
            submitButtonText="Create Invoice"
          />
        </Modal.Body>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => { setShowEditModal(false); resetFormLocal(); }} 
        size="xl" 
        centered 
        scrollable
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Edit Invoice - #{editingInvoice?.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <InvoiceForm
            isEdit={true}
            onSubmit={handleUpdateInvoiceClick}
            onCancel={() => { setShowEditModal(false); resetFormLocal(); }}
            submitButtonText="Update Invoice"
          />
        </Modal.Body>
      </Modal>

      {/* Invoice Preview Modal */}
      <Modal show={showInvoicePreview} onHide={() => setShowInvoicePreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice Preview - #{currentInvoice?.sequentialNumber || currentInvoice?.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentInvoice ? (
            <div className="p-3">
              <div className="text-center mb-4">
                <h2>TAX INVOICE</h2>
                <p>
                    <strong>Invoice #:</strong> {currentInvoice.sequentialNumber || currentInvoice.invoiceNumber}
                    <small className="text-muted ms-2 fw-normal fst-italic">
                        ({new Date(currentInvoice.createdAt).toLocaleDateString()})
                    </small>
                </p>
              </div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Bill From:</h5>
                  <p><strong>Cybomb Tech</strong></p>
                  <p>Prime Plaza, St.Thomas mount, Chennai</p>
                </Col>
                <Col md={6}>
                  {/* FIX: Look up customer from the customers array */}
                  {(() => {
                    const customerId = currentInvoice.customer?._id || currentInvoice.customer;
                    const customer = customers.find(c => c._id === customerId);
                    return (
                        <>
                            <h5>Bill To:</h5>
                            <p><strong>{customer?.name || 'Unknown Customer'}</strong></p>
                            <p>{customer?.phone || 'N/A'}</p>
                            <p>{customer?.email || 'N/A'}</p>
                        </>
                    );
                  })()}
                </Col>
              </Row>

              <Table responsive className="mb-4">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price (₹)</th>
                    <th>Tax %</th> 
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoice.items?.map((it, i) => (
                    <tr key={i}>
                      <td>{i+1}</td>
                      <td>{it.description}</td>
                      <td>{it.quantity}</td>
                      <td>₹{(it.price||0).toFixed(2)}</td>
                      <td>{it.taxRate ?? 'N/A'}</td> 
                      <td>₹{((it.quantity||0)*(it.price||0)).toFixed(2)}</td>
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
                        <td className="text-end">₹{(currentInvoice.subtotal||0).toFixed(2)}</td>
                      </tr>
                      {currentInvoice.taxDetails?.gstType === 'cgst_sgst' && currentInvoice.taxDetails?.cgstAmount > 0 ? (
                        <>
                          <tr>
                            <td>CGST ({currentInvoice.taxDetails?.cgst?.toFixed(2)}%)</td>
                            <td className="text-end">₹{(currentInvoice.taxDetails?.cgstAmount||0).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>SGST ({currentInvoice.taxDetails?.sgst?.toFixed(2)}%)</td>
                            <td className="text-end">₹{(currentInvoice.taxDetails?.sgstAmount||0).toFixed(2)}</td>
                          </tr>
                        </>
                      ) : currentInvoice.taxDetails?.totalTax > 0 ? (
                         <tr>
                          <td>IGST/Total Tax</td>
                          <td className="text-end">₹{(currentInvoice.taxDetails?.totalTax||0).toFixed(2)}</td>
                        </tr>
                      ) : null}
                      <tr className="fw-bold">
                        <td>Total</td>
                        <td className="text-end">₹{(currentInvoice.total||0).toFixed(2)}</td>
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
                  <strong> Due Date:</strong> {currentInvoice.dueDate ? new Date(currentInvoice.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ) : <div>No invoice selected</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowInvoicePreview(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleDownloadPDF(currentInvoice._id)}>
            <Printer size={16} className="me-2" />Print
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}