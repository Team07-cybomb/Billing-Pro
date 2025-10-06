// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { Tab, Nav, Row, Col, Card, Form, Button, Table, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { Briefcase, DollarSign, Users, Sliders, Trash, UserPlus, Save } from 'lucide-react';

// Base URL for all settings API calls (assuming a centralized settings route)
const SETTINGS_API_BASE_URL = "http://localhost:5000/api/settings";
const USERS_API_BASE_URL = "http://localhost:5000/api/users";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  
  // State for Settings Tabs
  const [company, setCompany] = useState({ name: "", email: "", phone: "", address: "", logo: "" });
  const [payment, setPayment] = useState({ bankName: "", accountNumber: "", ifsc: "", paypalEmail: "" });
  const [preferences, setPreferences] = useState({ operationalHours: "9:00 - 17:00", enable2FA: false, enableMaintenanceMode: false });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, []);

  // --- Core API Fetching Functions ---

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API_BASE_URL, { headers: getAuthHeaders() });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
        // ASSUMPTION: Backend has a single GET /api/settings route returning all saved settings
        const res = await axios.get(SETTINGS_API_BASE_URL, { headers: getAuthHeaders() });
        const data = res.data;

        // Apply fetched data, using existing state as fallback for fields not found
        if (data.company) setCompany(prev => ({ ...prev, ...data.company }));
        if (data.payment) setPayment(prev => ({ ...prev, ...data.payment }));
        if (data.preferences) setPreferences(prev => ({ ...prev, ...data.preferences }));

    } catch (error) {
        console.error("Error fetching settings:", error);
        showAlert('Failed to load saved settings.', 'danger');
    } finally {
        setLoading(false);
    }
  };


  // --- User Management Functions ---

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(USERS_API_BASE_URL, form, { headers: getAuthHeaders() });
      setForm({ username: "", email: "", password: "", role: "staff" });
      fetchUsers();
      showAlert('New user added successfully!', 'success');
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error);
      showAlert(`Error adding user: ${error.response?.data?.message || 'Check server logs.'}`, 'danger');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`${USERS_API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
      fetchUsers();
      showAlert('User deleted successfully.', 'success');
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      showAlert('Error deleting user.', 'danger');
    }
  };

  // --- Generic Save Function ---

  const handleSave = async (e, category, dataToSave) => {
    e.preventDefault();
    try {
        // ASSUMPTION: Backend uses PATCH or POST /api/settings/:category to update
        await axios.patch(`${SETTINGS_API_BASE_URL}/${category}`, dataToSave, { headers: getAuthHeaders() });
        showAlert(`${category} settings saved successfully!`, 'success');
    } catch (error) {
        console.error(`Error saving ${category} settings:`, error);
        showAlert(`Failed to save ${category} settings.`, 'danger');
    }
  };

  return (
    <div className="p-4">
      {alert.show && (
        <Alert variant={alert.type} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <h2 className="mb-4">Settings</h2>
      
      {loading ? (
        <div className="text-center py-5">
            <Spinner animation="border" className="me-2" /> Loading settings...
        </div>
      ) : (
        <Tab.Container defaultActiveKey="company">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="company"><Briefcase size={18} className="me-2" /> Company Info</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="preferences"><Sliders size={18} className="me-2" /> System Preferences</Nav.Link>
                </Nav.Item> */}
                <Nav.Item>
                  <Nav.Link eventKey="payment"><DollarSign size={18} className="me-2" /> Payment Settings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users"><Users size={18} className="me-2" /> Manage Users</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {/* --------------------- Company Info --------------------- */}
                <Tab.Pane eventKey="company">
                  <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white"><h5>Company Info</h5></Card.Header>
                    <Card.Body>
                      <Form onSubmit={(e) => handleSave(e, 'company', company)}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control as="textarea" rows={3} value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            <Save size={18} className="me-2" /> Save Company Info
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* --------------------- System Preferences (NEW FEATURE) --------------------- */}
                <Tab.Pane eventKey="preferences">
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white"><h5>System Preferences</h5></Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => handleSave(e, 'preferences', preferences)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Operational Hours</Form.Label>
                                    <Form.Control 
                                        value={preferences.operationalHours} 
                                        onChange={(e) => setPreferences({ ...preferences, operationalHours: e.target.value })} 
                                        placeholder="e.g., 9:00 - 17:00"
                                    />
                                    <Form.Text className="text-muted">Displayed on support and contact pages.</Form.Text>
                                </Form.Group>
                                
                                <Form.Group className="mb-3 d-flex align-items-center">
                                    <Form.Check 
                                        type="switch"
                                        id="enable-2fa-switch"
                                        label="Enable Two-Factor Authentication (2FA)"
                                        checked={preferences.enable2FA}
                                        onChange={(e) => setPreferences({ ...preferences, enable2FA: e.target.checked })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4 d-flex align-items-center">
                                    <Form.Check 
                                        type="switch"
                                        id="maintenance-mode-switch"
                                        label="Enable Maintenance Mode"
                                        checked={preferences.enableMaintenanceMode}
                                        onChange={(e) => setPreferences({ ...preferences, enableMaintenanceMode: e.target.checked })}
                                    />
                                    <Form.Text className="ms-3 text-danger">⚠️ Warning: Blocks access for all non-admin users.</Form.Text>
                                </Form.Group>

                                <Button type="submit" variant="success">
                                    <Save size={18} className="me-2" /> Save Preferences
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Tab.Pane>

                {/* --------------------- Payment Settings --------------------- */}
                <Tab.Pane eventKey="payment">
                  <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white"><h5>Payment Settings</h5></Card.Header>
                    <Card.Body>
                      <Form onSubmit={(e) => handleSave(e, 'payment', payment)}>
                        <Form.Group className="mb-3">
                          <Form.Label>Bank Name</Form.Label>
                          <Form.Control value={payment.bankName} onChange={(e) => setPayment({ ...payment, bankName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Account Number</Form.Label>
                          <Form.Control value={payment.accountNumber} onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>IFSC / Swift Code</Form.Label>
                          <Form.Control value={payment.ifsc} onChange={(e) => setPayment({ ...payment, ifsc: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>PayPal Email</Form.Label>
                          <Form.Control type="email" value={payment.paypalEmail} onChange={(e) => setPayment({ ...payment, paypalEmail: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            <Save size={18} className="me-2" /> Save Payment Settings
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* --------------------- Users Management --------------------- */}
                <Tab.Pane eventKey="users">
                  <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white"><h5>Manage Users</h5></Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleAddUser} className="row g-3 mb-4">
                        <div className="col-md-3">
                          <Form.Control placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                        </div>
                        <div className="col-md-3">
                          <Form.Control type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="col-md-2">
                          <Form.Control type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        </div>
                        <div className="col-md-2">
                          <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </Form.Select>
                        </div>
                        <div className="col-md-2">
                          <Button type="submit" variant="success" className="w-100">
                            <UserPlus size={18} className="me-1" /> Add
                          </Button>
                        </div>
                      </Form>

                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u._id}>
                              <td>{u.username}</td>
                              <td>{u.email}</td>
                              <td><span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-secondary"}`}>{u.role.toUpperCase()}</span></td>
                              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u._id)}>
                                    <Trash size={14} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </div>
  );
};

export default Settings;