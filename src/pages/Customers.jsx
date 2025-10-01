import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Table, Modal, Form, Badge } from 'react-bootstrap';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      fetchCustomers();
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', address: '', company: '' });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Customers</h2>
          <p className="text-muted mb-0">Manage your customer relationships</p>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus size={18} className="me-2" />
            Add Customer
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                {filteredCustomers.length} customers
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Invoices</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <span className="text-white fw-bold">
                          {customer.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{customer.company || '-'}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>
                    <Badge bg="outline-primary" className="border border-primary text-primary">
                      {customer.invoiceCount || 0}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={customer.status === 'active' ? 'success' : 'warning'}>
                      {customer.status || 'active'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                        <Edit size={14} className="me-1" />
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" className="d-flex align-items-center">
                        <Trash2 size={14} className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Customer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Add New Customer</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter customer name"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" className="px-4">
              Add Customer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;