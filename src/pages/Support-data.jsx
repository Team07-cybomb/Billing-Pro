import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Row, Col, Badge, Button, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { Mail, MessageSquare, Clock, User, CheckCircle, RefreshCw, Archive } from 'lucide-react';
import axios from 'axios';

// --- Configuration for Data Fetching ---
const SUPPORT_API_BASE_URL = 'http://localhost:5000/api/support';

// --- Mock Data Structure (Replace with actual data from your API) ---
const mockTickets = [
    { id: 'TKT-1001', subject: 'Login issue after update', customer: 'Alice Johnson', status: 'Open', priority: 'High', date: '2025-10-06T10:00:00Z', assignedTo: 'John' },
    { id: 'TKT-1002', subject: 'Invoice #0005 shows incorrect tax', customer: 'Bob Smith', status: 'Closed', priority: 'Medium', date: '2025-10-05T14:30:00Z', assignedTo: 'Admin' },
];

const mockEmails = [
    { id: 'EML-2001', subject: 'Question about pricing plans', sender: 'contact@example.com', body: 'We are interested in your pricing structure for 5 users...', status: 'Unread', date: '2025-10-07T08:15:00Z' },
    { id: 'EML-2002', subject: 'Payment confirmation for invoice #0008', sender: 'billing@clientcorp.com', body: 'Please confirm receipt of payment sent today.', status: 'Archived', date: '2025-10-06T11:45:00Z' },
];


const SupportData = () => {
    // State for both data types
    const [tickets, setTickets] = useState([]);
    const [emails, setEmails] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('tickets');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchSupportData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // --- Fetch Support Tickets ---
            // In a real app: const ticketsRes = await axios.get(`${SUPPORT_API_BASE_URL}/tickets`, { headers: getAuthHeaders() });
            const ticketsRes = { data: mockTickets }; // MOCK
            setTickets(ticketsRes.data);

            // --- Fetch Support Emails ---
            // In a real app: const emailsRes = await axios.get(`${SUPPORT_API_BASE_URL}/emails`, { headers: getAuthHeaders() });
            const emailsRes = { data: mockEmails }; // MOCK
            setEmails(emailsRes.data);

        } catch (e) {
            console.error("Error fetching support data:", e);
            setError("Failed to load support data from the server. Check API endpoints.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSupportData();
    }, [fetchSupportData]);

    // --- Helper Functions ---
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open': return <Badge bg="danger">Open</Badge>;
            case 'Closed': return <Badge bg="success">Closed</Badge>;
            case 'Pending': return <Badge bg="warning">Pending</Badge>;
            case 'Unread': return <Badge bg="primary">Unread</Badge>;
            case 'Archived': return <Badge bg="secondary">Archived</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };
    
    // --- Render Functions for Each Tab ---

    const renderTicketTable = () => (
        <Table responsive hover className="mb-0">
            <thead className="bg-light">
                <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Customer</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket.id}>
                        <td className="fw-semibold text-primary">{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td><User size={14} className="me-1 text-muted"/>{ticket.customer}</td>
                        <td><Badge bg={ticket.priority === 'High' ? 'danger' : 'info'}>{ticket.priority}</Badge></td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>{ticket.assignedTo}</td>
                        <td className="text-muted small">{new Date(ticket.date).toLocaleString()}</td>
                        <td>
                            <Button variant="outline-secondary" size="sm" onClick={() => alert(`Viewing ticket ${ticket.id}`)}>
                                <MessageSquare size={14} />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderEmailTable = () => (
        <Table responsive hover className="mb-0">
            <thead className="bg-light">
                <tr>
                    <th>Email ID</th>
                    <th>Subject</th>
                    <th>Sender</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {emails.map(email => (
                    <tr key={email.id} className={email.status === 'Unread' ? 'fw-bold' : ''}>
                        <td className="text-primary">{email.id}</td>
                        <td>{email.subject}</td>
                        <td><Mail size={14} className="me-1 text-muted"/>{email.sender}</td>
                        <td>{getStatusBadge(email.status)}</td>
                        <td className="text-muted small">{new Date(email.date).toLocaleString()}</td>
                        <td>
                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => alert(`Reading email from ${email.sender}:\n\n${email.body}`)}>
                                <MessageSquare size={14} />
                            </Button>
                            <Button variant="outline-secondary" size="sm" onClick={() => alert(`Archiving email ${email.id}`)}>
                                <Archive size={14} />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    // --- Main Render ---
    return (
        <div className="p-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="mb-1">Customer Support Hub</h2>
                    <p className="text-muted mb-0">Manage incoming issue tickets and communication channels.</p>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-primary" className="d-flex align-items-center" onClick={fetchSupportData} disabled={loading}>
                        <RefreshCw size={18} className="me-2" />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {error && <Alert variant="danger" className="m-3">{error}</Alert>}
                    
                    {loading && (
                        <div className="text-center py-5">
                            <Spinner animation="border" size="sm" className="me-2" /> Loading records...
                        </div>
                    )}
                    
                    {!loading && (
                        <Tabs
                            id="support-data-tabs"
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-3 ps-3 pt-3"
                        >
                            <Tab eventKey="tickets" title={<><MessageSquare size={16} className="me-2"/> Issue Tickets ({tickets.length})</>}>
                                {renderTicketTable()}
                            </Tab>
                            <Tab eventKey="emails" title={<><Mail size={16} className="me-2"/> Support Emails ({emails.length})</>}>
                                {renderEmailTable()}
                            </Tab>
                        </Tabs>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default SupportData;