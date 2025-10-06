import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Table, Modal, Form, Badge, Alert, InputGroup, Dropdown } from 'react-bootstrap';
import { Plus, Search, Edit, Trash2, MoreVertical, Eye, Download, User, Phone, Mail, MapPin } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Error fetching customers', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      if (!formData.name.trim() || !formData.phone.trim()) {
        showAlert('Name and phone number are required', 'warning');
        setSubmitting(false);
        return;
      }

      if (formData._id) {
        // Update existing
        await axios.put(
          `http://localhost:5000/api/customers/${formData._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert('Customer updated successfully!', 'success');
      } else {
        // Create new
        await axios.post(
          'http://localhost:5000/api/customers',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert('Customer created successfully!', 'success');
      }

      await fetchCustomers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving customer:', error);
      const errorMessage = error.response?.data?.message || 'Error saving customer';
      showAlert(errorMessage, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCustomers();
      showAlert('Customer deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting customer';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/customers/export/csv', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('Customers exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting customers:', error);
      showAlert('Error exporting customers', 'danger');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.gstNumber?.toLowerCase().includes(searchLower)
    );
  });

  // --- Customer Modal with local state ---
  const CustomerModal = ({ show, onHide, isEdit, initialData }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
      setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.startsWith('address.')) {
        const field = name.split('.')[1];
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, [field]: value }
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleSubmitWrapper = (e) => {
      e.preventDefault();
      if (isEdit) {
        handleSubmit({ ...formData, _id: initialData._id });
      } else {
        handleSubmit(formData);
      }
    };

    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitWrapper}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><User size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><Phone size={16} /></InputGroup.Text>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><Mail size={16} /></InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>GST Number</Form.Label>
              <Form.Control
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                disabled={submitting}
              />
            </Form.Group>
            <Card className="border">
              <Card.Header><MapPin size={16} className="me-2" /> Address</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={onHide} disabled={submitting}>Cancel</Button>
            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="p-4">
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Customers</h2>
          <p className="text-muted">Manage your customer relationships</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleExportCSV}>
            <Download size={18} className="me-2" /> Export CSV
          </Button>
          <Button variant="success" onClick={handleAddCustomer} className="ms-2">
            <Plus size={18} className="me-2" /> Add Customer
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Row>
            <Col md={6}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark">{filteredCustomers.length} customers</Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  {/* <th>GST</th> */}
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone} {customer.email && <><br />{customer.email}</>}</td>
                    {/* <td>{customer.gstNumber || '-'}</td> */}
                    <td>{customer.address?.city || '-'}</td>
                    <td><Badge bg="success">Active</Badge></td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm"><MoreVertical size={16} /></Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEditCustomer(customer)}>
                            <Edit size={16} className="me-2" /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDeleteCustomer(customer._id)} className="text-danger">
                            <Trash2 size={16} className="me-2" /> Delete
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

      {/* Modals */}
      <CustomerModal
        show={showModal}
        onHide={handleCloseModal}
        isEdit={false}
        initialData={{
          name: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', zipCode: '' },
          gstNumber: ''
        }}
      />
      {editingCustomer && (
        <CustomerModal
          show={showEditModal}
          onHide={handleCloseModal}
          isEdit={true}
          initialData={editingCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
