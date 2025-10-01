import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import { Plus, Download, MoreVertical, Eye, Printer, Edit, FileText } from 'lucide-react';
import axios from 'axios';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting invoices:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Invoices</h2>
          <p className="text-muted mb-0">Create and manage customer invoices</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-primary" className="d-flex align-items-center" onClick={handleExportCSV}>
            <Download size={18} className="me-2" />
            Export
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
            <Col md={6}>
              <Form.Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border-0 bg-light"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </Form.Select>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                {filteredInvoices.length} invoices
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Amount</th>
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
                          {invoice.customer?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {invoice.customer?.name}
                    </div>
                  </td>
                  <td className="fw-semibold">${invoice.total}</td>
                  <td>
                    <Badge bg={getStatusVariant(invoice.status)} className="rounded-pill">
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="text-muted">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" className="border-0">
                        <MoreVertical size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Eye size={16} className="me-2" />
                          View
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Edit size={16} className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <Printer size={16} className="me-2" />
                          Print
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">
                          <Download size={16} className="me-2" />
                          Download PDF
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Create Invoice Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title className="h5">Create New Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer</Form.Label>
                  <Form.Select>
                    <option>Select Customer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Invoice Items</Form.Label>
              <Card className="border">
                <Card.Body>
                  <div className="text-center text-muted py-4">
                    <Plus size={32} className="mb-2" />
                    <div>Add items to this invoice</div>
                  </div>
                </Card.Body>
              </Card>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Additional notes..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success">Create Invoice</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Invoices;