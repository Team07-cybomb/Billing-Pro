// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { Tab, Nav, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import axios from "axios";

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  const [company, setCompany] = useState({ name: "", email: "", phone: "", address: "", logo: "" });
  const [invoiceSettings, setInvoiceSettings] = useState({ prefix: "INV", currency: "USD", taxRate: 0 });
  const [payment, setPayment] = useState({ bankName: "", accountNumber: "", ifsc: "", paypalEmail: "" });

  useEffect(() => {
    fetchUsers();
    // TODO: fetch saved company/invoice/payment settings from backend
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", form);
      setForm({ username: "", email: "", password: "", role: "staff" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCompanySave = (e) => {
    e.preventDefault();
    console.log("Save company settings:", company);
    // axios.post("/api/settings/company", company);
  };

  const handleInvoiceSave = (e) => {
    e.preventDefault();
    console.log("Save invoice settings:", invoiceSettings);
    // axios.post("/api/settings/invoice", invoiceSettings);
  };

  const handlePaymentSave = (e) => {
    e.preventDefault();
    console.log("Save payment settings:", payment);
    // axios.post("/api/settings/payment", payment);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Settings</h2>
      <Tab.Container defaultActiveKey="company">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="company">🏢 Company Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="invoice">🧾 Invoice Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="payment">💳 Payment Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">👥 Manage Users</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {/* Company Info */}
              <Tab.Pane eventKey="company">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white"><h5>Company Info</h5></Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleCompanySave}>
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
                      <Button type="submit" variant="success">Save Company Info</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Invoice Settings */}
              <Tab.Pane eventKey="invoice">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white"><h5>Invoice Settings</h5></Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleInvoiceSave}>
                      <Form.Group className="mb-3">
                        <Form.Label>Invoice Prefix</Form.Label>
                        <Form.Control value={invoiceSettings.prefix} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select value={invoiceSettings.currency} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, currency: e.target.value })}>
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                          <option value="EUR">EUR</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Default Tax (%)</Form.Label>
                        <Form.Control type="number" value={invoiceSettings.taxRate} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, taxRate: e.target.value })} />
                      </Form.Group>
                      <Button type="submit" variant="success">Save Invoice Settings</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Payment Settings */}
              <Tab.Pane eventKey="payment">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white"><h5>Payment Settings</h5></Card.Header>
                  <Card.Body>
                    <Form onSubmit={handlePaymentSave}>
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
                      <Button type="submit" variant="success">Save Payment Settings</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Users Management */}
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
                        <Button type="submit" variant="success" className="w-100">Add</Button>
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
                            <td><span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-secondary"}`}>{u.role}</span></td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u._id)}>Delete</Button></td>
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
    </div>
  );
};

export default Settings;
