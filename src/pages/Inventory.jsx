import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Button, Badge, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Plus, Search, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      const productsWithStock = response.data.map(product => ({
        ...product,
        stock: Math.floor(Math.random() * 100),
        lowStockThreshold: 10
      }));
      setProducts(productsWithStock);
      setLowStockProducts(productsWithStock.filter(p => p.stock <= p.lowStockThreshold));
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

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

  const getStockPercentage = (stock) => {
    const maxStock = 100; // Assuming 100 as max for demo
    return (stock / maxStock) * 100;
  };

  return (
    <div className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Inventory Management</h2>
          <p className="text-muted mb-0">Track and manage your product inventory</p>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Add Product
          </Button>
        </Col>
      </Row>

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
                    {products.filter(p => p.stock === 0).length}
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
                  <h6 className="text-muted mb-2">Inventory Value</h6>
                  <h3 className="fw-bold text-success">
                    ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
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

      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                {filteredProducts.length} items
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
                <th>Actions</th>
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
                      {product.sku}
                    </Badge>
                  </td>
                  <td>{product.category}</td>
                  <td className="fw-semibold">${product.price}</td>
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
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        Restock
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Enter product name" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control type="text" placeholder="Product SKU" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" placeholder="0.00" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Initial Stock</Form.Label>
              <Form.Control type="number" placeholder="0" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" placeholder="Product category" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success">Add Product</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inventory;