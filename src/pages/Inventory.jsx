// Inventory.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // <-- FIX: ADDED useMemo HERE
import { Card, Table, Row, Col, Button, Badge, Form, Modal, ProgressBar, InputGroup, Alert } from 'react-bootstrap';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Zap } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // State for Modals/Forms
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState(0);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  const fetchInventory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // --- SIMULATING STOCK FIELD INTEGRATION ---
      const productsWithStock = response.data.map(product => ({
        ...product,
        // Ensure default values are used if not provided by API
        stock: product.stock ?? Math.floor(Math.random() * 100),
        costPrice: product.costPrice ?? product.price * 0.5,
        lowStockThreshold: product.lowStockThreshold ?? 10
      }));
      // ------------------------------------------

      setProducts(productsWithStock);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showAlert('Error fetching inventory data.', 'danger');
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // --- Derived Metrics (using useMemo) ---
  const lowStockProducts = useMemo(() => 
    products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
  , [products]);
  
  const outOfStockProducts = useMemo(() => 
    products.filter(p => p.stock === 0)
  , [products]);
  
  const totalInventoryValue = useMemo(() => 
    products.reduce((sum, p) => sum + ((p.costPrice || p.price) * p.stock), 0)
  , [products]);


  // --- Action Handlers ---

  const openRestockModal = (product) => {
    setCurrentProduct(product);
    setRestockAmount(1); // Default restock amount
    setShowRestockModal(true);
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!currentProduct || restockAmount <= 0) return;

    try {
        const token = localStorage.getItem('token');
        const newStock = currentProduct.stock + restockAmount;
        
        // --- API CALL TO UPDATE STOCK ---
        await axios.put(`http://localhost:5000/api/products/${currentProduct._id}/stock`, {
            stock: newStock 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Optimistic UI update
        setProducts(prev => prev.map(p => 
            p._id === currentProduct._id ? { ...p, stock: newStock } : p
        ));
        
        showAlert(`Successfully restocked ${restockAmount} units of ${currentProduct.name}.`, 'success');
        setShowRestockModal(false);
        setCurrentProduct(null);

    } catch (error) {
        console.error('Restock error:', error);
        showAlert('Error performing restock. Check console.', 'danger');
    }
  };

  // --- Display Helpers ---

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockVariant = (stock, threshold) => {
    if (stock === 0) return 'danger';
    if (stock <= threshold) return 'warning';
    return 'success';
  };

  const getStockPercentage = (stock, max = 100) => {
    const effectiveMax = Math.max(max, 100); 
    return Math.min(100, (stock / effectiveMax) * 100);
  };
  
  const getStockStatusLabel = (stock, threshold) => {
      if (stock === 0) return 'Out of Stock';
      if (stock <= threshold) return 'Low Stock';
      return 'In Stock';
  }

  return (
    <div className="p-4">
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
          {alert.message}
        </Alert>
      )}
      
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Inventory Management</h2>
          <p className="text-muted mb-0">Track and manage your product inventory</p>
        </Col>
        <Col xs="auto">
        <Link to="/products" className='text-decoration-none'>
         {/* NOTE: Linking to Products page for actual creation */}
          <Button variant="success" className="d-flex align-items-center" onClick={() => showAlert('Redirecting to Products page to add item.', 'info')}>
            <Plus size={18} className="me-2" />
            Add New Product
          </Button>
        </Link>
         
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Products</h6>
                  <h3 className="fw-bold text-primary">{products.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <Package size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Low Stock</h6>
                  <h3 className="fw-bold text-warning">{lowStockProducts.length}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <AlertTriangle size={24} className="text-warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Out of Stock</h6>
                  <h3 className="fw-bold text-danger">
                    {outOfStockProducts.length}
                  </h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <AlertTriangle size={24} className="text-danger" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Inventory Value (Cost)</h6>
                  <h3 className="fw-bold text-success">
                    ${totalInventoryValue.toFixed(2).toLocaleString()}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <TrendingUp size={24} className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Inventory Table */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search inventory (name, SKU, category)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                Showing {filteredProducts.length} of {products.length} items
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <Package size={18} className="text-muted" />
                      </div>
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">{product.description}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-secondary" className="border border-secondary text-dark">
                      {product.sku || 'N/A'}
                    </Badge>
                  </td>
                  <td>{product.category || 'N/A'}</td>
                  <td className="fw-semibold">${(product.price || 0).toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 me-3">
                        <ProgressBar 
                          variant={getStockVariant(product.stock, product.lowStockThreshold)}
                          now={getStockPercentage(product.stock)}
                          style={{ height: '6px' }}
                        />
                      </div>
                      <small className="fw-semibold">{product.stock} units</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStockVariant(product.stock, product.lowStockThreshold)} className="rounded-pill">
                      {getStockStatusLabel(product.stock, product.lowStockThreshold)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        title="Restock"
                        onClick={() => openRestockModal(product)}
                      >
                        <Zap size={14} />
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        title="Edit Product Details"
                        onClick={() => showAlert('Use the main Products page to edit full product details.', 'info')}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
               {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Restock Modal */}
      <Modal show={showRestockModal} onHide={() => setShowRestockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">Restock: {currentProduct?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRestock}>
          <Modal.Body>
            <p>Current Stock: <Badge bg={getStockVariant(currentProduct?.stock, currentProduct?.lowStockThreshold)}>{currentProduct?.stock} units</Badge></p>
            <Form.Group className="mb-3">
              <Form.Label>Amount to Restock</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                  required
                />
                <InputGroup.Text>units</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {currentProduct && (
              <Alert variant="info">
                New Stock Level will be: <strong>{currentProduct.stock + restockAmount} units</strong>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={() => setShowRestockModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={restockAmount <= 0}>
              <Zap size={16} className="me-2" />
              Confirm Restock
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;