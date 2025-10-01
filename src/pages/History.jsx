import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Badge, Button } from 'react-bootstrap';
import { Calendar, Filter, Download } from 'lucide-react';
import axios from 'axios';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'invoice': return '📄';
      case 'payment': return '💳';
      case 'refund': return '↩️';
      default: return '📊';
    }
  };

  return (
    <div className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Transaction History</h2>
          <p className="text-muted mb-0">Track and manage all your transactions</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" className="d-flex align-items-center">
            <Download size={18} className="me-2" />
            Export
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col md={4}>
              <div className="d-flex align-items-center">
                <Filter size={18} className="text-muted me-2" />
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
              </div>
            </Col>
            <Col md={8}>
              <Row className="g-2">
                <Col>
                  <div className="position-relative">
                    <Calendar size={16} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="ps-5"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="position-relative">
                    <Calendar size={16} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
                    <Form.Control
                      type="date"
                      placeholder="End Date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="ps-5"
                    />
                  </div>
                </Col>
                <Col xs="auto">
                  <Button variant="primary">Apply</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Invoice #</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="me-2">{getTypeIcon('invoice')}</span>
                      <span className="text-capitalize">Invoice</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">Invoice Payment</div>
                      <small className="text-muted">{transaction.items?.length || 0} items</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                        <span className="text-white fw-bold small">
                          {transaction.customer?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {transaction.customer?.name}
                    </div>
                  </td>
                  <td className="fw-semibold">
                    <div className="text-success">${transaction.total}</div>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(transaction.status)} className="rounded-pill">
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="fw-semibold text-primary">
                    #{transaction.invoiceNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="text-success fw-bold fs-4">${transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0).toLocaleString()}</span>
              </div>
              <h5 className="fw-semibold">Total Revenue</h5>
              <p className="text-muted mb-0">All paid transactions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="text-primary fw-bold fs-4">{transactions.length}</span>
              </div>
              <h5 className="fw-semibold">Total Transactions</h5>
              <p className="text-muted mb-0">All time transactions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="text-warning fw-bold fs-4">{transactions.filter(t => t.status === 'pending').length}</span>
              </div>
              <h5 className="fw-semibold">Pending</h5>
              <p className="text-muted mb-0">Awaiting payment</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default History;