import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Operations = () => {
  // Data for operations to keep the code DRY and organized
  const operationsData = {
    orders: [
      { name: 'Online Orders', icon: 'fas fa-shopping-cart' },
      { name: 'KDTs', icon: 'fas fa-receipt' },
      { name: 'Customers', icon: 'fas fa-users' },
      { name: 'Cash Flow', icon: 'fas fa-chart-line' },
      { name: 'Expense', icon: 'fas fa-money-bill-wave' },
      { name: 'Withdrawal', icon: 'fas fa-credit-card' },
      { name: 'Cash Top-Up', icon: 'fas fa-plus-circle' },
      { name: 'Inventory', icon: 'fas fa-boxes' }
    ],
    notification: [
      { name: 'Table', icon: 'fas fa-table' },
      { name: 'Manual Sync', icon: 'fas fa-sync-alt' },
      { name: 'Help', icon: 'fas fa-question-circle' },
      { name: 'Live View', icon: 'fas fa-eye' },
      { name: 'Due Payment', icon: 'fas fa-clock' },
      { name: 'Language Profiles', icon: 'fas fa-globe' },
      { name: 'Billing User Profile', icon: 'fas fa-user' },
      { name: 'Currency Conversion', icon: 'fas fa-exchange-alt' }
    ],
    restaurant: [
      { name: 'Menu', icon: 'fas fa-globe' },
      { name: 'Discount', icon: 'fas fa-fire' },
      { name: 'Billing Screen', icon: 'fas fa-cog' },
      { name: 'Discussions', icon: 'fas fa-comments' },
      { name: 'Bring Screen', icon: 'fas fa-mobile-alt' },
      { name: 'Settings', icon: 'fas fa-sliders-h' },
      { name: 'Services Renewal', icon: 'fas fa-user' },
      { name: 'Bill/KOT Print', icon: 'fas fa-compass' },
      { name: 'Contact Us', icon: 'fas fa-phone' }
    ]
  };

  // Reusable Operation Item Component
  const OperationItem = ({ name, icon }) => (
    <div className="d-flex flex-column align-items-center p-3 border bg-white rounded hover-cursor operation-item">
      <div className="mb-2 p-2 bg-light rounded-circle d-flex align-items-center justify-content-center icon-container">
        <i className={`${icon} text-primary fs-4`}></i>
      </div>
      <span className="text-dark small fw-medium text-center operation-label">
        {name}
      </span>
    </div>
  );

  // Reusable Section Component
  const OperationsSection = ({ title, operations, columns = 2 }) => (
    <Col md={4} className="mb-4">
      <Card className="h-100 shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {operations.map((operation, index) => (
              <Col xs={6} key={index}>
                <OperationItem name={operation.name} icon={operation.icon} />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid className="p-4 bg-light">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-dark fw-bold">Operations</h2>
        <p className="text-muted">Various modes</p>
      </div>

      {/* Main Operations Sections */}
      <Row>
        <OperationsSection 
          title="Orders" 
          operations={operationsData.orders} 
        />
        
        <OperationsSection 
          title="Notification" 
          operations={operationsData.notification} 
        />

        {/* Additional Section - You can add more sections here */}
        <OperationsSection 
          title="Reports" 
          operations={[
            { name: 'Daily Report', icon: 'fas fa-chart-bar' },
            { name: 'Monthly Report', icon: 'fas fa-chart-pie' },
            { name: 'Sales Analysis', icon: 'fas fa-analytics' },
            { name: 'Customer Insights', icon: 'fas fa-chart-line' },
            { name: 'Inventory Report', icon: 'fas fa-clipboard-list' },
            { name: 'Financial Summary', icon: 'fas fa-file-invoice-dollar' },
            { name: 'Performance Metrics', icon: 'fas fa-tachometer-alt' },
            { name: 'Export Data', icon: 'fas fa-download' }
          ]} 
        />
      </Row>

      {/* Join for your restaurant Section */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Join for your restaurant</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {operationsData.restaurant.map((item, index) => (
              <Col xs={6} md={4} lg={3} key={index}>
                <OperationItem name={item.name} icon={item.icon} />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <style jsx>{`
        .operation-item {
          transition: all 0.3s ease;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .operation-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-color: #0d6efd !important;
        }
        
        .icon-container {
          width: 60px;
          height: 60px;
          transition: all 0.3s ease;
        }
        
        .operation-item:hover .icon-container {
          background-color: #e3f2fd !important;
          transform: scale(1.1);
        }
        
        .operation-label {
          line-height: 1.2;
          min-height: 2.4em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hover-cursor {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default Operations;