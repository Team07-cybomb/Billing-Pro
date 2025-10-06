// InvoiceBackend.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// Assuming useAuth is available in your environment, but not needed for data logic here.
// import { useAuth } from '../context/AuthContext'; 

/**
 * useInvoiceBackend
 * - centralises API calls + state management for invoices feature
 * - returns state + action handlers for the UI layer
 */
export default function useInvoiceBackend() {
  // Global States (Data)
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Form States (Invoice Creation/Edit)
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  
  // NOTE: TaxDetails state is kept for data structure compatibility 
  // with existing APIs/DB, but its values are now unused/overwritten 
  // by item-level tax logic in calculateTotals.
  const [taxDetails, setTaxDetails] = useState({ 
    cgst: 9, 
    sgst: 9, 
    igst: 0, 
    gstType: 'cgst_sgst' 
  }); 

  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentType, setPaymentType] = useState('cash');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  }, []);
  
  // --- API Handlers ---

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices', { headers: getAuthHeaders() });
      const invoicesData = res.data.invoices || res.data;
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (err) {
      console.error('fetchInvoices error', err);
      showAlert('Error fetching invoices', 'danger');
    }
  }, [showAlert]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers', { headers: getAuthHeaders() });
      setCustomers(res.data);
    } catch (err) {
      console.error('fetchCustomers error', err);
      showAlert('Error fetching customers', 'danger');
    }
  }, [showAlert]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', { headers: getAuthHeaders() });
      setProducts(res.data);
    } catch (err) {
      console.error('fetchProducts error', err);
      showAlert('Error fetching products', 'danger');
    }
  }, [showAlert]);

  const createInvoice = async (invoicePayload) => {
    try {
      const res = await axios.post('http://localhost:5000/api/invoices', invoicePayload, { headers: getAuthHeaders() });
      await fetchInvoices();
      showAlert('Invoice created successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error('createInvoice error', err);
      const message = err.response?.data?.message || 'Error creating invoice';
      showAlert(message, 'danger');
      throw err;
    }
  };

  const updateInvoice = async (invoiceId, invoicePayload) => {
    try {
      await axios.put(`http://localhost:5000/api/invoices/${invoiceId}`, invoicePayload, { headers: getAuthHeaders() });
      await fetchInvoices();
      showAlert('Invoice updated successfully!', 'success');
    } catch (err) {
      console.error('updateInvoice error', err);
      const message = err.response?.data?.message || 'Error updating invoice';
      showAlert(message, 'danger');
      throw err;
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`, { headers: getAuthHeaders() });
      await fetchInvoices();
      showAlert('Invoice deleted successfully!', 'success');
    } catch (err) {
      console.error('deleteInvoice error', err);
      showAlert('Error deleting invoice', 'danger');
      throw err;
    }
  };
  
  const createCustomer = async (customerPayload) => {
    try {
      const res = await axios.post('http://localhost:5000/api/customers', customerPayload, { headers: getAuthHeaders() });
      setCustomers(prev => [...prev, res.data]);
      showAlert('Customer created successfully', 'success');
      return res.data;
    } catch (err) {
      console.error('createCustomer error', err);
      showAlert('Error creating customer', 'danger');
      throw err;
    }
  };

  const searchCustomerByPhone = async (phone) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/search?phone=${encodeURIComponent(phone)}`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      console.warn('searchCustomerByPhone', err);
      return null;
    }
  };

  const exportInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices/export', { responseType: 'blob', headers: getAuthHeaders() });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('Invoices exported successfully', 'success');
    } catch (err) {
      console.error('exportInvoices error', err);
      showAlert('Error exporting invoices', 'danger');
    }
  };
  
  // --- Invoice Item Handlers ---

  const addItem = () => {
    setInvoiceItems(prev => [...prev, {
      product: '',
      description: '',
      hsnCode: '',
      quantity: 1,
      price: 0,
      taxRate: 18 // Default tax rate
    }]);
  };

  const removeItem = (index) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setInvoiceItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      // Populate item details when a product is selected
      if (field === 'product' && value) {
        const found = products.find(p => p._id === value);
        if (found) {
          copy[index].price = typeof found.price === 'number' ? found.price : parseFloat(found.price || 0);
          copy[index].description = found.description || found.name || copy[index].description;
          copy[index].hsnCode = found.hsnCode || '';
          // IMPORTANT: Use product's taxRate only, ignoring the global taxDetails state
          copy[index].taxRate = found.taxRate ?? 18; 
        }
      }

      return copy;
    });
  };

  // --- Calculations ---

  const calculateTotalsForItems = useCallback((items = invoiceItems) => {
    let subtotal = 0;
    let totalTax = 0;
    
    // Calculate total tax based on each item's price * quantity * individual taxRate
    items.forEach(it => {
      const price = Number(it.price) || 0;
      const quantity = Number(it.quantity) || 0;
      const taxRate = Number(it.taxRate) || 0;
      const itemSubtotal = price * quantity;
      
      subtotal += itemSubtotal;
      totalTax += itemSubtotal * (taxRate / 100);
    });

    const total = subtotal + totalTax;
    
    // Derive tax details for summary (assuming CGST/SGST split for display purposes)
    const avgTaxRate = (subtotal > 0) ? (totalTax / subtotal) * 100 : 0;
    const cgstAmount = totalTax / 2;
    const sgstAmount = totalTax / 2;
    const igstAmount = totalTax;
    
    // Structure the output to match the expected API payload structure
    return { 
      subtotal, 
      cgstAmount, 
      sgstAmount, 
      igstAmount, 
      totalTax, 
      total,
      taxDetails: {
        // Use a 50/50 split for CGST/SGST display rates
        cgst: avgTaxRate / 2, 
        sgst: avgTaxRate / 2,
        igst: avgTaxRate,
        // Assume CGST+SGST type if there is any tax, otherwise no tax.
        gstType: totalTax > 0 ? 'cgst_sgst' : 'none' 
      }
    };
  }, [invoiceItems]);
  
  // --- Form Reset ---

  const resetForm = () => {
    setSelectedCustomer(null);
    setInvoiceItems([]);
    // Only reset taxDetails to default structure, not values, as they are unused for calculation
    setTaxDetails({ cgst: 9, sgst: 9, igst: 0, gstType: 'cgst_sgst' }); 
    setNotes('');
    setDueDate('');
    setPaymentType('cash');
  };

  // --- Initial Load ---

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchProducts();
  }, [fetchInvoices, fetchCustomers, fetchProducts]);

  return {
    // Data
    invoices,
    customers,
    products,

    // Form State (kept taxDetails for compatibility but its values are ignored for calculation)
    selectedCustomer,
    setSelectedCustomer,
    invoiceItems,
    setInvoiceItems,
    taxDetails, // Included for edit/display compatibility, but UI ignores setter/updater
    setTaxDetails, // Included for edit/display compatibility, but UI ignores setter/updater
    notes,
    setNotes,
    dueDate,
    setDueDate,
    paymentType,
    setPaymentType,

    // Actions
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

    // Totals & Helpers
    calculateTotalsForItems,
    resetForm,
    
    // Alerts
    alert,
    showAlert
  };
}