import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const PrivacyPolicy = () => {
    // Custom SVG Checkmark Icon Component
    const CheckIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 40 40"
            className="me-2 flex-shrink-0"
            style={{ marginTop: '2px' }}
        >
            <path fill="#98ccfd" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"></path>
            <path fill="#4788c7" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"></path>
            <g>
                <path fill="#fff" d="M16.025 28.02L9.118 21.113 11.24 18.992 16.025 23.777 28.118 11.684 30.24 13.805z"></path>
            </g>
        </svg>
    );

    // Custom list item with check icon
    const ListItem = ({ children }) => (
        <li className="mb-2 d-flex align-items-start">
            <CheckIcon />
            <span>{children}</span>
        </li>
    );

    return (
        <Container fluid className="p-4 bg-light">
            <div className="mb-4">
                <h2 className="text-dark fw-bold">Privacy Policy</h2>
            </div>

            {/* Introduction Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-info-circle text-primary me-2"></i> 1. Introduction
                    </h4>
                    <p className="text-muted">
                        On Billing Pro we, provides a general billing management system.
                        This Privacy Policy is designed to inform you of our policies regarding the collection, use, and
                        disclosure of personal information we receive from users of our Service.
                    </p>
                    <p className="text-muted">
                        By using the Service, you agree to the collection and use of information in accordance with this policy.
                        We will not use or share your information with anyone except as described in this Privacy Policy.
                    </p>
                </Card.Body>
            </Card>

            {/* Information We Collect Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-database text-primary me-2"></i> 2. Information We Collect
                    </h4>
                    <p className="text-muted mb-3">We collect various types of information to provide and improve our Service.</p>

                    <h6 className="text-dark fw-bold">A. Information You Provide to Us:</h6>
                    <ul className="text-muted list-unstyled">
                        <ListItem>
                            <strong>Account Information:</strong> When you register for an account, we collect your name, email address, company name, and contact information.
                        </ListItem>
                        <ListItem>
                            <strong>Billing and Payment Information:</strong> To process billing and payments, we collect financial information. We use third-party payment processors to handle this information securely.
                        </ListItem>
                        <ListItem>
                            <strong>Customer and Client Information:</strong> As a billing management system, our Service is designed to handle your clients' data.
                        </ListItem>
                        <ListItem>
                            <strong>Invoicing and Transaction Data:</strong> We collect and store data related to the invoices and transactions you create.
                        </ListItem>
                        <ListItem>
                            <strong>Communications:</strong> When you contact us for support, we collect the content of those communications.
                        </ListItem>
                    </ul>

                    <h6 className="text-dark fw-bold mt-4">B. Information Collected Automatically:</h6>
                    <ul className="text-muted list-unstyled">
                        <ListItem>
                            <strong>Usage Data:</strong> We may collect information about how you access and use the Service.
                        </ListItem>
                        <ListItem>
                            <strong>Device Information:</strong> We may collect information about the device you use to access the Service.
                        </ListItem>
                        <ListItem>
                            <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service.
                        </ListItem>
                    </ul>
                </Card.Body>
            </Card>

            {/* How We Use Your Information */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-cogs text-primary me-2"></i> 3. How We Use Your Information
                    </h4>
                    <Row>
                        <Col md={6}>
                            <ul className="text-muted list-unstyled">
                                <ListItem>To Provide and Maintain the Service</ListItem>
                                <ListItem>To Improve Our Service</ListItem>
                                <ListItem>To Communicate With You</ListItem>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <ul className="text-muted list-unstyled">
                                <ListItem>For Security purposes</ListItem>
                                <ListItem>To Fulfill Legal Obligations</ListItem>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* How We Share Your Information */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-share-alt text-primary me-2"></i> 4. How We Share Your Information
                    </h4>
                    <p className="text-muted mb-3">We do not sell, rent, or trade your personal information. We may share your information only in the following situations:</p>
                    <ul className="text-muted list-unstyled">
                        <ListItem>
                            <strong>With Your Consent:</strong> We will share your information with your explicit consent.
                        </ListItem>
                        <ListItem>
                            <strong>With Third-Party Service Providers:</strong> We may share your information with third-party vendors and service providers who perform services on our behalf.
                        </ListItem>
                        <ListItem>
                            <strong>For Legal Reasons:</strong> We may disclose your personal information if required to do so by law.
                        </ListItem>
                        <ListItem>
                            <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your personal information may be transferred.
                        </ListItem>
                    </ul>
                </Card.Body>
            </Card>

            {/* Data Security */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-shield-alt text-primary me-2"></i> 5. Data Security
                    </h4>
                    <p className="text-muted">
                        The security of your personal information is important to us. We implement commercially reasonable technical,
                        physical, and administrative safeguards to protect the information we collect and store. However, no method of
                        transmission over the Internet or electronic storage is 100% secure.
                    </p>
                </Card.Body>
            </Card>

            {/* Data Retention */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-archive text-primary me-2"></i> 6. Data Retention
                    </h4>
                    <p className="text-muted">
                        We will retain your personal information only for as long as is necessary for the purposes set out in this
                        Privacy Policy. This includes retaining and using your information to comply with our legal obligations,
                        resolve disputes, and enforce our legal agreements and policies.
                    </p>
                </Card.Body>
            </Card>

            {/* Your Rights and Choices */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-user-check text-primary me-2"></i> 7. Your Rights and Choices
                    </h4>
                    <Row>
                        <Col md={6}>
                            <ul className="text-muted list-unstyled">
                                <ListItem>
                                    <strong>Right to Access:</strong> Request a copy of your personal information.
                                </ListItem>
                                <ListItem>
                                    <strong>Right to Rectification:</strong> Correct incomplete or inaccurate data.
                                </ListItem>
                                <ListItem>
                                    <strong>Right to Erasure:</strong> Request deletion of your personal information.
                                </ListItem>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <ul className="text-muted list-unstyled">
                                <ListItem>
                                    <strong>Right to Object:</strong> Object to processing of your data.
                                </ListItem>
                                <ListItem>
                                    <strong>Right to Portability:</strong> Receive your data in a machine-readable format.
                                </ListItem>
                                <ListItem>
                                    <strong>Right to Lodge a Complaint:</strong> Complain to a supervisory authority.
                                </ListItem>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Privacy of Your Clients' Data */}
            <Card className="mb-4 shadow-sm">
                <Card.Body className="p-4">
                    <h4 className="text-dark mb-3">
                        <i className="fas fa-users text-primary me-2"></i> 8. Privacy of Your Clients' Data
                    </h4>
                    <p className="text-muted mb-3">
                        As a user of our Service, you are responsible for the data you input about your own clients and customers.
                        You are considered the "Data Controller," and we are the "Data Processor" in this relationship.
                    </p>
                    <p className="text-muted">
                        You are responsible for obtaining consent from your clients, ensuring data accuracy, and responding to
                        any requests from your clients to exercise their privacy rights.
                    </p>
                </Card.Body>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                        <svg
                            className="me-2 mt-1"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <h4 className="text-dark mb-0">Contact Us</h4>
                    </div>
                    <p className="text-muted">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p className="text-muted mb-0">
                        <strong>Email:</strong> privacy@billingpro.com<br />
                        <strong>Address:</strong> 123 Business Street, Suite 100, City, State 12345
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PrivacyPolicy;