import React, { useState } from 'react';
import { Card, Container, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { Search, Mail, Phone, MessageSquare, BookOpen, Download, HelpCircle } from 'lucide-react';
import axios from 'axios';

// API Endpoint for submitting new tickets
const SUPPORT_TICKET_API = 'http://localhost:5000/api/support/tickets';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: 'technical', // Default to Technical Support
    message: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      // NOTE: This simulates searching a knowledge base (KB)
      showAlert(`Simulating search for: "${searchTerm}". (KB Lookup not implemented)`, 'info');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      department: 'technical',
      message: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        // The backend should automatically link the user/staff ID via the auth token
      };
      
      const response = await axios.post(SUPPORT_TICKET_API, payload, {
        headers: getAuthHeaders()
      });
      
      showAlert(`Ticket #${response.data.ticketId} submitted successfully!`, 'success');
      resetForm();
    } catch (error) {
      console.error('Ticket submission failed:', error.response?.data || error);
      showAlert(`Failed to submit ticket. Error: ${error.response?.data?.message || 'Server error.'}`, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (title) => {
    showAlert(`Simulating action: ${title}`, 'info');
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="text-dark fw-bold mb-1">Staff Support Portal</h2>
          <p className="text-muted mb-0">Quickly resolve issues or access vital resources.</p>
        </Col>
      </Row>
      
      {alert.show && (
        <Alert variant={alert.type} className="mb-3" dismissible onClose={() => showAlert('', 'hidden')}>
          {alert.message}
        </Alert>
      )}

      {/* 1. Knowledge Base Search */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <h5 className="text-primary mb-3"><BookOpen size={20} className="me-2" /> Search Knowledge Base</h5>
          <Form className="d-flex" onSubmit={handleSearch}>
            <InputGroup style={{ maxWidth: '600px' }}>
              <Form.Control
                type="text"
                placeholder="Search FAQs, guides, or troubleshooting steps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                <Search size={20} />
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
      
      {/* 2. Quick Contact & Resources */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="text-dark mb-4"><HelpCircle size={20} className="me-2" /> Quick Actions & Contact</h5>
          
          <Row className="g-4 text-center">
            <Col md={3}>
              <div onClick={() => handleCardClick('Video Guides')} className="p-3 border rounded-3 bg-light cursor-pointer hover-shadow" style={{ cursor: 'pointer' }}>
                <Download size={24} className="text-info mb-2" />
                <div className="fw-semibold small">Video Guides</div>
              </div>
            </Col>
            
            <Col md={3}>
              <div onClick={() => handleCardClick('Internal Docs')} className="p-3 border rounded-3 bg-light cursor-pointer hover-shadow" style={{ cursor: 'pointer' }}>
                <BookOpen size={24} className="text-success mb-2" />
                <div className="fw-semibold small">Internal Docs</div>
              </div>
            </Col>
            
            <Col md={3}>
              <div onClick={() => handleCardClick('Phone Support')} className="p-3 border rounded-3 bg-light cursor-pointer hover-shadow" style={{ cursor: 'pointer' }}>
                <Phone size={24} className="text-warning mb-2" />
                <div className="fw-semibold small">Phone Support</div>
              </div>
            </Col>

            <Col md={3}>
              <div onClick={() => handleCardClick('Email Support')} className="p-3 border rounded-3 bg-light cursor-pointer hover-shadow" style={{ cursor: 'pointer' }}>
                <Mail size={24} className="text-primary mb-2" />
                <div className="fw-semibold small">Email Support</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* 3. Submit New Ticket Form */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h5 className="text-dark mb-4"><MessageSquare size={20} className="me-2" /> Submit a New Issue Ticket</h5>
          
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Management</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Message / Details *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Describe the issue, including steps to reproduce, if applicable."
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Issue Ticket'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {/* Basic styles for hover effect */}
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
};

export default Support;
