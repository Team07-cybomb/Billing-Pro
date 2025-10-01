import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { TrendingUp, Users, Package, FileText, Plus, LogOut } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalInvoices: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [invoicesRes, productsRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/invoices'),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/customers')
      ]);

      const totalSales = invoicesRes.data.reduce((sum, invoice) => sum + invoice.total, 0);

      setStats({
        totalSales,
        totalInvoices: invoicesRes.data.length,
        totalProducts: productsRes.data.length,
        totalCustomers: customersRes.data.length,
      });

      setRecentInvoices(invoicesRes.data.slice(0, 5));
      setTopProducts(productsRes.data.slice(0, 4));
      setRecentCustomers(customersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="p-3 d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
        <div className={`bg-${color}-subtle rounded-circle p-3`}>
          <Icon size={28} className={`text-${color}`} />
        </div>
      </Card.Body>
    </Card>
  );

  // Sales chart data (fake monthly data for now)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [500, 1200, 900, 1500, 1800, stats.totalSales], // demo data
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="d-flex">


      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.username}!</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/invoices">
              <Button variant="success" className="d-flex align-items-center">
                <Plus size={18} className="me-2" /> New Invoice
              </Button>
            </Link>
            <Button variant="outline-danger" onClick={handleLogout} className="d-flex align-items-center">
              <LogOut size={18} className="me-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <StatCard title="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} icon={TrendingUp} color="success" />
          </Col>
          <Col md={3}>
            <StatCard title="Invoices" value={stats.totalInvoices.toLocaleString()} icon={FileText} color="primary" />
          </Col>
          <Col md={3}>
            <StatCard title="Products" value={stats.totalProducts.toLocaleString()} icon={Package} color="warning" />
          </Col>
          <Col md={3}>
            <StatCard title="Customers" value={stats.totalCustomers.toLocaleString()} icon={Users} color="info" />
          </Col>
        </Row>

        {/* Content row */}
        <Row className="g-4">
          {/* Recent invoices */}
          <Col md={8}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Recent Invoices</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map(invoice => (
                      <tr key={invoice._id}>
                        <td>#{invoice.invoiceNumber}</td>
                        <td>{invoice.customer?.name}</td>
                        <td>${invoice.total}</td>
                        <td><span className={`badge ${
                          invoice.status === 'paid' ? 'bg-success' : 
                          invoice.status === 'overdue' ? 'bg-danger' : 'bg-warning'
                        }`}>{invoice.status}</span></td>
                        <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Right column (Quick actions + charts + customers) */}
          <Col md={4}>
            {/* Quick Actions */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  {user?.role === "staff" && (
                    <>
                      <Link to="/invoices"><Button variant="success">Create Invoice</Button></Link>
                      <Link to="/customers"><Button variant="outline-info">Add Customer</Button></Link>
                    </>
                  )}
                  {user?.role === "admin" && (
                    <>
                      <Link to="/products"><Button variant="outline-primary">Add Product</Button></Link>
                      <Link to="/reports"><Button variant="outline-warning">View Reports</Button></Link>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Sales Chart */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Sales (Last 6 Months)</h5>
              </Card.Header>
              <Card.Body>
                <Line data={chartData} />
              </Card.Body>
            </Card>

            {/* Recent Customers */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Recent Customers</h5>
              </Card.Header>
              <Card.Body>
                {recentCustomers.map((cust, i) => (
                  <div key={cust._id} className="d-flex justify-content-between mb-2">
                    <span>{cust.name}</span>
                    <span className="text-muted">{cust.email}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
