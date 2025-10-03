import React, { useState } from 'react';
import { Card, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: '',
    message: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      alert(`Searching for: ${searchTerm}`);
      // In a real implementation, this would trigger a search through the knowledge base
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Your support request has been submitted. We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      department: '',
      message: ''
    });
  };

  const handleCardClick = (title) => {
    alert(`Opening: ${title}`);
  };

  const handleContactOptionClick = (title) => {
    alert(`Initiating: ${title}`);
  };

  return (
    <Container fluid className="p-4 bg-light">
      <div className="mb-4">
        <h2 className="text-dark fw-bold">Support</h2>
      </div>
      
      {/* Search Bar with Icon on Blue Button */}
     <Form className="d-flex mb-4" style={{ maxWidth: '500px' }} onSubmit={handleSearch}>
  <Form.Control
    type="text"
    placeholder="Search our knowledge base..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="rounded-0 rounded-start"
  />
  <Button 
    type="submit" 
    variant="primary" 
    className="rounded-0 rounded-end d-flex align-items-center justify-content-center"
    style={{ minWidth: '60px' }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="22" 
      height="22" 
      viewBox="0 0 50 50"
      fill="currentColor"
    >
      <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
    </svg>
  </Button>
</Form>
      
      {/* Self-Service Resources */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <h4 className="text-dark mb-3">
            <i className="fas fa-book text-primary me-2"></i> Self-Service Resources
          </h4>
          <p className="text-muted mb-4">Find answers to common questions and learn how to make the most of Billing Pro.</p>
          
          <Row>
            <Col md={4} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light cursor-pointer"
                style={{ borderLeft: '4px solid #3498db!important', transition: 'all 0.3s ease' }}
                onClick={() => handleCardClick('Knowledge Base & FAQs')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body>
                  <h5 className="text-dark">Knowledge Base & FAQs</h5>
                  <p className="text-muted small">
                    Browse our comprehensive library of articles covering common questions, how-to guides, and troubleshooting steps.
                  </p>
                  <Button variant="primary" size="sm">Browse Articles</Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light cursor-pointer"
                style={{ borderLeft: '4px solid #3498db!important', transition: 'all 0.3s ease' }}
                onClick={() => handleCardClick('Video Tutorials')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body>
                  <h5 className="text-dark">Video Tutorials</h5>
                  <p className="text-muted small">
                    Watch short, clear videos that demonstrate how to use product features or solve common issues.
                  </p>
                  <Button variant="primary" size="sm">Watch Tutorials</Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light cursor-pointer"
                style={{ borderLeft: '4px solid #3498db!important', transition: 'all 0.3s ease' }}
                onClick={() => handleCardClick('User Manuals & Guides')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body>
                  <h5 className="text-dark">User Manuals & Guides</h5>
                  <p className="text-muted small">
                    Download detailed PDF guides and manuals for in-depth product information.
                  </p>
                  <Button variant="primary" size="sm">Download Guides</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Contact Options */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <h4 className="text-dark mb-3">
            <i className="fas fa-envelope text-primary me-2"></i> Contact Options
          </h4>
          <p className="text-muted mb-4">When self-service isn't enough, our support team is here to help.</p>
          
          <Row>
            <Col md={3} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light text-center cursor-pointer"
                onClick={() => handleContactOptionClick('Live Chat')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body className="p-3">
                  <i className="fas fa-comments text-primary fs-2 mb-3"></i>
                  <h5 className="text-dark">Live Chat</h5>
                  <p className="text-muted small">Get immediate help from our support agents</p>
                  <span className="badge bg-success">Online Now</span>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light text-center cursor-pointer"
                onClick={() => handleContactOptionClick('Phone Support')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body className="p-3">
                  <i className="fas fa-phone text-primary fs-2 mb-3"></i>
                  <h5 className="text-dark">Phone Support</h5>
                  <p className="text-muted small">Call us for urgent or complex issues</p>
                  <p className="small mb-0"><strong>Hours:</strong> 9AM-6PM EST</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light text-center cursor-pointer"
                onClick={() => handleContactOptionClick('Email Support')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body className="p-3">
                  <i className="fas fa-envelope-open-text text-primary fs-2 mb-3"></i>
                  <h5 className="text-dark">Email Support</h5>
                  <p className="text-muted small">Send us a message for non-urgent issues</p>
                  <p className="small mb-0"><strong>Response:</strong> Within 24 hours</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light text-center cursor-pointer"
                onClick={() => handleContactOptionClick('Submit a Ticket')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body className="p-3">
                  <i className="fas fa-ticket-alt text-primary fs-2 mb-3"></i>
                  <h5 className="text-dark">Submit a Ticket</h5>
                  <p className="text-muted small">Create a support ticket for detailed assistance</p>
                  <Button variant="primary" size="sm">Create Ticket</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Contact Form */}
          <h5 className="mt-5 mb-3">Contact Form</h5>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Subject</Form.Label>
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
                  <Form.Label className="fw-medium text-dark">Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select a department</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Management</option>
                    <option value="feature">Feature Request</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Please describe your issue in detail"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Button type="submit" variant="primary">Submit Request</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Community and Status Updates */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <h4 className="text-dark mb-3">
            <i className="fas fa-users text-primary me-2"></i> Community and Status Updates
          </h4>
          
          <Row>
            <Col md={6} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light cursor-pointer"
                style={{ borderLeft: '4px solid #3498db!important', transition: 'all 0.3s ease' }}
                onClick={() => handleCardClick('Community Forum')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body>
                  <h5 className="text-dark">Community Forum</h5>
                  <p className="text-muted small">
                    Connect with other Billing Pro users, share tips, and discuss common issues.
                  </p>
                  <Button variant="primary" size="sm">Join Community</Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-3">
              <Card 
                className="h-100 border-0 bg-light cursor-pointer"
                style={{ borderLeft: '4px solid #3498db!important', transition: 'all 0.3s ease' }}
                onClick={() => handleCardClick('System Status')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Body>
                  <h5 className="text-dark">System Status</h5>
                  <p className="text-muted small">
                    Check the current status of all Billing Pro services and view incident history.
                  </p>
                  <Button variant="primary" size="sm">View Status</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Policy and Legal Information */}
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h4 className="text-dark mb-3">
            <i className="fas fa-file-contract text-primary me-2"></i> Policy and Legal Information
          </h4>
          
          <div className="d-flex flex-wrap gap-3">
             <Link to="/PrivacyPolicy" className="text-primary text-decoration-none small">Shipping & Returns Policy</Link>
            <Link to="/PrivacyPolicy" className="text-primary text-decoration-none small">Privacy Policy</Link>
             <Link to="/PrivacyPolicy" className="text-primary text-decoration-none small">Terms of Service</Link>
             <Link to="/PrivacyPolicy"className="text-primary text-decoration-none small">Service Level Agreement</Link>
             <Link to="/PrivacyPolicy"className="text-primary text-decoration-none small">Data Processing Agreement</Link>
             <Link to="/PrivacyPolicy" className="text-primary text-decoration-none small">Cookie Policy</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Support;