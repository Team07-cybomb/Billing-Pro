// Reports.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Spinner, Alert, Button, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { TrendingUp, DollarSign, Clock, Package, BarChart, UserCheck, ListTodo, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

// NOTE: Assuming you have a way to determine the user's role (e.g., via useAuth context)
// For this example, we'll assume a local state for the role.

// --- Helper Functions (Moved outside the component for re-render optimization) ---

const getStatusBadge = (status) => {
    switch (status) {
        case 'Completed': return <Badge bg="success">Completed</Badge>;
        case 'In Progress': return <Badge bg="primary">In Progress</Badge>;
        case 'Pending': return <Badge bg="warning">Pending</Badge>;
        default: return <Badge bg="secondary">{status}</Badge>;
    }
};

const Reports = ({ userRole = 'admin' }) => {
  const [invoices, setInvoices] = useState([]);
  const [staffLogs, setStaffLogs] = useState([]); // State for Staff Logs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for sorting the detailed logs table
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // --- Data Fetching ---

  const fetchInvoices = useCallback(async () => {
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/invoices?limit=1000', { 
        headers: getAuthHeaders()
      });
      
      const invoicesData = response.data.invoices || response.data;
      
      const processedInvoices = Array.isArray(invoicesData) 
        ? invoicesData.map(inv => ({ 
            ...inv, 
            // FIX 1: Normalize status to lowercase for robust calculation
            status: (inv.status || '').toLowerCase(), 
            // FIX 2: Ensure total is a valid float
            total: parseFloat(inv.total) || 0.00 
        }))
        : [];
      
      setInvoices(processedInvoices);
    } catch (err) {
      console.error('Error fetching invoice report data:', err);
      setError('Failed to load financial data. Check API connection.');
    }
  }, []);

  const fetchStaffLogs = useCallback(async () => {
      if (userRole !== 'admin') return; 
      
      try {
          // Fetch all staff logs (assuming this endpoint allows admin to see all logs)
          const response = await axios.get('http://localhost:5000/api/stafflogs', { 
              headers: getAuthHeaders() 
          });
          
          const logsData = response.data || [];
          setStaffLogs(Array.isArray(logsData) ? logsData : []);
      } catch (err) {
          console.error('Error fetching staff log data:', err);
      }
  }, [userRole]);

  const initialFetch = useCallback(async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
          fetchInvoices(),
          fetchStaffLogs()
      ]);
      setLoading(false);
  }, [fetchInvoices, fetchStaffLogs]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  // --- Data Analysis ---

  const { totalRevenue, outstanding } = useMemo(() => {
    let revenue = 0;
    let outstandingBalance = 0;

    invoices.forEach(inv => {
      // Use normalized status (lowercase) for reliable check
      if (inv.status === 'paid') {
        revenue += inv.total;
      } else if (inv.status === 'pending' || inv.status === 'overdue' || inv.status === 'draft') {
        outstandingBalance += inv.total;
      }
    });

    return { totalRevenue: revenue, outstanding: outstandingBalance };
  }, [invoices]);

  const salesByMonth = useMemo(() => {
    const monthlySales = {};
    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        const date = new Date(inv.createdAt);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlySales[monthYear] = (monthlySales[monthYear] || 0) + inv.total;
      }
    });
    return Object.keys(monthlySales).sort().map(key => ({ month: key, sales: monthlySales[key] }));
  }, [invoices]);

  const topProducts = useMemo(() => {
    const productSales = {};
    invoices.forEach(inv => {
      inv.items?.forEach(item => {
        const productId = item.product?._id || item.product;
        const productName = item.description || item.product?.name || 'Unknown Product';
        const quantity = parseFloat(item.quantity) || 0;
        
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = { name: productName, totalQuantity: 0, totalRevenue: 0 };
          }
          productSales[productId].totalQuantity += quantity;
          productSales[productId].totalRevenue += (parseFloat(item.price) || 0) * quantity;
        }
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity) 
      .slice(0, 5); 
  }, [invoices]);
  
  const staffLogSummary = useMemo(() => {
    const totalTasks = staffLogs.length;
    const completedTasks = staffLogs.filter(log => log.status === 'Completed').length;
    const pendingTasks = staffLogs.filter(log => log.status === 'Pending' || log.status === 'In Progress').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const uniqueStaff = [...new Set(staffLogs.map(log => log.userName).filter(name => name))].length;

    return { totalTasks, completedTasks, pendingTasks, completionRate, uniqueStaff };
  }, [staffLogs]);

  // Helper to format currency (assuming '₹')
  const formatCurrency = (amount) => `₹${amount.toFixed(2).toLocaleString('en-IN')}`;

  // --- Sorting Logic for Staff Logs Table ---

  const sortedLogs = useMemo(() => {
    // 1. Create a copy of the logs to sort
    let sortableItems = [...staffLogs];
    
    // 2. Sort based on config
    sortableItems.sort((a, b) => {
      // Handle date fields
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'date') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      } 
      // Handle string fields (userName, category, status)
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

    return sortableItems;
  }, [staffLogs, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="ms-1" /> : <ChevronDown size={14} className="ms-1" />;
  };


  // --- Render Logic ---

  if (loading) {
    return (
      <div className="p-5 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading Reports...
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="m-4">{error}</Alert>;
  }


  // --- Staff Logs Detail Table Component (Inner Component - same) ---
  const StaffLogsTable = () => (
    <Card className="shadow-sm border-0 mb-5">
      <Card.Header className="bg-white py-3">
        <h5 className="mb-0">Detailed Staff Activity Log ({staffLogs.length} Records)</h5>
      </Card.Header>
      <Card.Body className="p-0">
        {sortedLogs.length === 0 ? (
            <div className="text-center py-4 text-muted">No staff activity logs found.</div>
        ) : (
            <Table responsive hover className="mb-0">
                <thead className="bg-light">
                    <tr>
                        <th>#</th>
                        <th onClick={() => requestSort('userName')} className="cursor-pointer">
                            Staff Name {getSortIcon('userName')}
                        </th>
                        <th onClick={() => requestSort('category')} className="cursor-pointer">
                            Category {getSortIcon('category')}
                        </th>
                        <th>Task Details</th>
                        <th onClick={() => requestSort('status')} className="cursor-pointer">
                            Status {getSortIcon('status')}
                        </th>
                        <th onClick={() => requestSort('date')} className="cursor-pointer">
                            Activity Date {getSortIcon('date')}
                        </th>
                        <th onClick={() => requestSort('createdAt')} className="cursor-pointer">
                            Logged Time {getSortIcon('createdAt')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLogs.map((log, index) => (
                        <tr key={log._id}>
                            <td>{index + 1}</td>
                            <td>
                                <Badge bg="info" className="text-uppercase">{log.userName || 'N/A'}</Badge>
                            </td>
                            <td>{log.category}</td>
                            <td>{log.details.length > 80 ? log.details.substring(0, 80) + '...' : log.details}</td>
                            <td>{getStatusBadge(log.status)}</td>
                            <td>{new Date(log.date).toLocaleDateString()}</td>
                            <td className="text-muted small">
                                {new Date(log.createdAt).toLocaleTimeString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
      </Card.Body>
    </Card>
  );


  // --- Main Component Structure ---
  return (
    <div className="p-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Business Reports</h2>
          <p className="text-muted mb-0">Analytics and key performance indicators</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" size="sm" onClick={initialFetch}>
            <RefreshCw size={18} className="me-2" /> Refresh All Data
          </Button>
        </Col>
      </Row>

      {/* 1. FINANCIAL OVERVIEW (Admin Only) */}
      {userRole === 'admin' && (
        <>
          <h3 className="h5 mb-3 text-primary">Financial Summary (Admin View)</h3>
          <Row className="g-4 mb-5">
            <Col md={4}>
              {/* Card for Total Revenue */}
              <Card className="shadow-sm border-0 border-start border-5 border-success h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-success text-uppercase mb-2">Total Revenue (Paid)</h6>
                      {/* totalRevenue should now be correct due to robust fetching/memoizing */}
                      <h3 className="fw-bold">{formatCurrency(totalRevenue)}</h3> 
                    </div>
                    <DollarSign size={36} className="text-success opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              {/* Card for Outstanding A/R */}
              <Card className="shadow-sm border-0 border-start border-5 border-warning h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-warning text-uppercase mb-2">Outstanding A/R</h6>
                      <h3 className="fw-bold">{formatCurrency(outstanding)}</h3>
                    </div>
                    <Clock size={36} className="text-warning opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              {/* Card for Total Transactions */}
              <Card className="shadow-sm border-0 border-start border-5 border-primary h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted text-uppercase mb-2">Total Transactions</h6>
                      <h3 className="fw-bold">{invoices.length}</h3>
                    </div>
                    <BarChart size={36} className="text-primary opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* 2. STAFF LOGS SUMMARY (Admin Only) (same) */}
      {userRole === 'admin' && (
        <>
          <h3 className="h5 mb-3 text-primary">Staff Activity Overview</h3>
          <Card className="shadow-sm border-0 mb-5">
              <Card.Body>
                  <Row className="g-4">
                      <Col md={3}>
                          <h6 className="text-muted text-uppercase mb-2">Total Tasks Logged</h6>
                          <h3 className="fw-bold text-primary">{staffLogSummary.totalTasks}</h3>
                          <small className="text-muted">Tasks by all staff</small>
                      </Col>
                      <Col md={3}>
                          <h6 className="text-muted text-uppercase mb-2">Tasks Completed</h6>
                          <h3 className="fw-bold text-success">{staffLogSummary.completedTasks}</h3>
                          <small className="text-muted">{staffLogSummary.completionRate.toFixed(1)}% Completion Rate</small>
                      </Col>
                      <Col md={3}>
                          <h6 className="text-muted text-uppercase mb-2">Pending / In Progress</h6>
                          <h3 className="fw-bold text-warning">{staffLogSummary.pendingTasks}</h3>
                          <small className="text-muted">Requires follow-up</small>
                      </Col>
                      <Col md={3}>
                          <h6 className="text-muted text-uppercase mb-2">Active Staff</h6>
                          <h3 className="fw-bold text-info">{staffLogSummary.uniqueStaff}</h3>
                          <small className="text-muted">Logged activity recently</small>
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
          
          {/* 3. STAFF LOGS DETAIL TABLE (NEW SECTION) */}
          <h3 className="h5 mb-3 text-primary">Staff Log Details</h3>
          <StaffLogsTable />
        </>
      )}


      {/* 4. SALES OVER TIME (General Use / Admin) (same) */}
      <h3 className="h5 mb-3 text-primary">Sales Trend Analysis</h3>
      <Card className="shadow-sm border-0 mb-5">
        <Card.Body>
          <h6 className="card-title mb-4">Monthly Sales (Total Paid)</h6>
          {salesByMonth.length === 0 ? (
            <p className="text-center text-muted">No paid sales data available yet.</p>
          ) : (
            <div style={{ height: '250px', overflowY: 'auto' }}>
              <ul className="list-unstyled">
                {salesByMonth.map(item => (
                  <li key={item.month} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="fw-semibold">{item.month}</span>
                    <span className="text-success fw-bold">{formatCurrency(item.sales)}</span>
                  </li>
                ))}
              </ul>
              <small className="text-muted d-block mt-3">
                *Integration point for a charting library (e.g., Recharts) would render a visual graph here.
              </small>
            </div>
          )}
        </Card.Body>
      </Card>


      {/* 5. PRODUCT PERFORMANCE (Staff/Admin) (same) */}
      <h3 className="h5 mb-3 text-primary">Top Selling Products</h3>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col md={7}>
              <h6 className="card-title mb-3">Top 5 by Quantity Sold</h6>
              {topProducts.length === 0 ? (
                <p className="text-center text-muted">No products sold yet.</p>
              ) : (
                <ul className="list-unstyled">
                  {topProducts.map((product, index) => (
                    <li key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <Badge pill bg="primary" className="me-3">{index + 1}</Badge>
                        <span className="fw-semibold">{product.name}</span>
                      </div>
                      <div className="text-end">
                        <span className="d-block fw-bold">{product.totalQuantity} units</span>
                        <small className="text-muted">Rev: {formatCurrency(product.totalRevenue)}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Col>
            <Col md={5}>
              <h6 className="card-title mb-3">Inventory Health Indicators</h6>
              <div className="p-3 bg-light rounded">
                <p className="mb-1 d-flex justify-content-between">
                  <Package size={16} className="me-2 text-primary" />
                  Total Items Sold:
                  <Badge bg="primary">
                    {topProducts.reduce((sum, p) => sum + p.totalQuantity, 0)}
                  </Badge>
                </p>
                <p className="mb-1 d-flex justify-content-between">
                  <TrendingUp size={16} className="me-2 text-success" />
                  Highest Seller:
                  <span className="fw-bold text-success">
                    {topProducts[0]?.name || 'N/A'}
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Reports;