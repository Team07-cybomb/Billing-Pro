import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Row, 
  Col, 
  Modal, 
  Form,
  Alert,
  Badge,
  InputGroup,
  Dropdown
} from 'react-bootstrap';
import axios from 'axios';
import { Plus, Download, MoreVertical, Search, Edit, Trash2, RefreshCw } from 'lucide-react';

const SETTINGS_API_BASE_URL = "http://localhost:5000/api/settings";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    sku: '',
    category: '',
    taxRate: '',
    stock: '', 
    lowStockThreshold: 10
  });

  // --- CURRENCY STATE ---
  const [currencySymbol, setCurrencySymbol] = useState('$'); 
  const [currencyCode, setCurrencyCode] = useState('USD'); 

  // Sample categories for dropdown
  const categories = [
    'All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 
    'Sports', 'Beauty', 'Toys', 'Automotive', 'Food & Beverages'
  ];
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };
  
  // Helper to format currency based on state
  const formatCurrency = (amount) => {
    const numAmount = Number(amount) || 0;
    
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);

    const symbolMap = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'AUD': 'A$', 'CAD': 'C$' };
    const displaySymbol = symbolMap[currencyCode] || currencySymbol;

    // Use string replacement for flexibility in symbol placement
    if (formatted.includes(currencyCode)) {
        return formatted.replace(currencyCode, displaySymbol).trim();
    }
    
    return `${displaySymbol} ${numAmount.toFixed(2).toLocaleString()}`;
  };
  
  const fetchSettings = useCallback(async () => {
    try {
        const res = await axios.get(SETTINGS_API_BASE_URL, { headers: getAuthHeaders() });
        const currencySetting = res.data.company?.currency || 'USD';
        setCurrencyCode(currencySetting);
        
        const symbolMap = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£', 'AUD': 'A$', 'CAD': 'C$' };
        setCurrencySymbol(symbolMap[currencySetting] || currencySetting);
    } catch (error) {
        console.warn("Could not fetch currency settings, defaulting to USD.");
    }
  }, []);


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

  const initialFetch = useCallback(async () => {
      await Promise.all([
          fetchSettings(),
          fetchProducts()
      ]);
  }, [fetchSettings]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  
// In Products.jsx - Enhanced handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    
    // Convert string values to numbers
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      taxRate: formData.taxRate ? parseFloat(formData.taxRate) : 18,
      stock: parseInt(formData.stock) || 0, // Ensure stock is an integer
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10
    };

    if (editingProduct) {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, submitData, {
        headers: getAuthHeaders()
      });
      showAlert('Product updated successfully');
    } else {
      await axios.post('http://localhost:5000/api/products', submitData, {
        headers: getAuthHeaders()
      });
      showAlert('Product created successfully');
    }
    fetchProducts();
    setShowModal(false);
    resetForm();
  } catch (error) {
    console.error('Error saving product:', error);
    const errorMessage = error.response?.data?.message || 'Error saving product';
    showAlert(errorMessage, 'danger');
  }
};

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      costPrice: product.costPrice || '',
      sku: product.sku || '',
      category: product.category || '',
      taxRate: product.taxRate || '',
      // Populate new fields
      stock: product.stock || '',
      lowStockThreshold: product.lowStockThreshold || 10
    });
    setShowModal(true);
  };

const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/api/products/${editingProduct._id}`, {
      headers: getAuthHeaders(),
    });

    showAlert('Product deleted successfully');
    fetchProducts();
    setShowDeleteModal(false);
    resetForm();
  } catch (error) {
    console.error('Error deleting product:', error);
    showAlert('Error deleting product', 'danger');
  }
};


  const confirmDelete = (product) => {
    setEditingProduct(product);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      costPrice: '',
      sku: '',
      category: '',
      taxRate: '',
      // Reset new fields
      stock: '',
      lowStockThreshold: 10
    });
    setEditingProduct(null);
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products/export', {
        responseType: 'blob',
        headers: getAuthHeaders()
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('Products exported successfully');
    } catch (error) {
      console.error('Error exporting products:', error);
      showAlert('Error exporting products', 'danger');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateGST = (price, taxRate = 18) => {
    const p = parseFloat(price) || 0;
    const r = parseFloat(taxRate) || 18;
    return (p * r / 100).toFixed(2);
  };

  const calculateTotalWithTax = (price, taxRate = 18) => {
    const p = parseFloat(price) || 0;
    const gst = parseFloat(calculateGST(price, taxRate)) || 0;
    return (p + gst).toFixed(2);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h2>Products Management</h2>
          <p className="text-muted">Manage your product inventory and pricing</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary" className="d-flex align-items-center" onClick={initialFetch}>
            <RefreshCw size={18} className="me-2" /> Refresh
          </Button>
          <Button variant="success" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Add Product
          </Button>
          <Button variant="outline-primary" className="d-flex align-items-center" onClick={handleExportCSV}>
            <Download size={18} className="me-2" />
            Export CSV
          </Button>
        </Col>
      </Row>

      {/* Currency Alert */}
      <Alert variant="info" className="mb-4 py-2 small">
          Prices displayed in: <strong className='text-uppercase'>{currencyCode} ({currencySymbol})</strong>
      </Alert>


      {/* Filters */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Products</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-light">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Product List ({filteredProducts.length} items)</h5>
            </Col>
            <Col xs="auto">
              <Badge bg="secondary" className="me-2">
                Total: {products.length}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Base Price</th>
                <th>Total Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small className="text-muted d-block">{product.description}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-secondary" text="dark">
                      {product.sku || 'N/A'}
                    </Badge>
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <strong>{formatCurrency(calculateTotalWithTax(product.price, product.taxRate))}</strong>
                  </td>
                  <td>
                    {product.category && (
                      <Badge bg="primary">{product.category}</Badge>
                    )}
                  </td>
                   <td>
                    <Badge bg={product.stock === 0 ? "danger" : (product.stock || 0) <= (product.lowStockThreshold || 10) ? "warning" : "success"}>
                      {product.stock ?? 'N/A'} units
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        title="Edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        title="Delete"
                        onClick={() => confirmDelete(product)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No products found. {searchTerm || selectedCategory !== 'All' ? 'Try changing your filters.' : 'Add your first product!'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Unique stock keeping unit"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
              />
            </Form.Group>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ({currencySymbol}) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost Price ({currencySymbol})</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    placeholder="18"
                  />
                  <Form.Text className="text-muted">
                    Default GST rate is 18%
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Initial Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {formData.price && (
              <Card className="bg-light">
                <Card.Body>
                  <Row>
                    <Col>
                      <strong>Price Summary:</strong>
                    </Col>
                    <Col>Base Price: {formatCurrency(formData.price)}</Col>
                    <Col>
                      GST: {formatCurrency(calculateGST(formData.price, formData.taxRate))} 
                      ({formData.taxRate || 18}%)
                    </Col>
                    <Col>
                      <strong>Total: {formatCurrency(calculateTotalWithTax(formData.price, formData.taxRate))}</strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{editingProduct?.name}</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
