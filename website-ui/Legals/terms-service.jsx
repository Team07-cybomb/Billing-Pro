// src/pages/TermsOfService.jsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="font-sans min-h-screen bg-light py-5">
            <Container className="my-5">
                <Button 
                    as={Link} 
                    to="/home" 
                    variant="outline-primary" 
                    className="mb-4 rounded-pill d-inline-flex align-items-center"
                >
                    <ArrowLeft size={18} className="me-2" />
                    Back to home
                </Button>

                <Card className="shadow-lg border-0">
                    {/* Header */}
                    <div className="legal-header text-white text-center py-5 rounded-top-3">
                        <FileText size={48} className="mb-3" />
                        <h1 className="fw-bold display-5 mb-1">Terms of Service</h1>
                        <p className="lead opacity-90">Effective date: September 2025</p>
                    </div>
                    
                    {/* Content Body */}
                    <Card.Body className="p-4 p-md-5">
                        <div className="mb-5">
                            <p className="text-muted lead">
                                Welcome to Billing Pro. These Terms of Service govern your use of our billing and inventory management 
                                software and services. Please read them carefully before using our service.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">1. Acceptance of Terms</h2>
                            <p className="text-muted lh-base">
                                By accessing or using Billing Pro, you agree to be bound by these Terms of Service and our Privacy Policy. 
                                If you disagree with any part of the terms, then you may not access the service.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">2. Your Account</h2>
                            <p className="text-muted lh-base">
                                You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                                responsibility for all activities that occur under your account.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">You must be at least 18 years old to use this service</li>
                                <li className="mb-2">You must provide accurate and complete registration information</li>
                                <li className="mb-2">You are responsible for all activities under your account</li>
                                <li>You must notify us immediately of any unauthorized use of your account</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">3. Service Limitations</h2>
                            <p className="text-muted lh-base">
                                Billing Pro is provided "as is" and "as available". We reserve the right to modify or discontinue the service 
                                with or without notice at any time. We are not liable for any losses due to service interruptions.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">4. User Responsibilities</h2>
                            <p className="text-muted lh-base">
                                You agree to use Billing Pro in compliance with all applicable laws and regulations. You are solely responsible 
                                for the content you create and the data you manage through our service.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">Comply with all applicable tax laws and regulations</li>
                                <li className="mb-2">Ensure the accuracy of all invoicing and billing data</li>
                                <li className="mb-2">Maintain proper records as required by law</li>
                                <li>Do not use the service for illegal or fraudulent activities</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">5. Payments and Billing</h2>
                            <p className="text-muted lh-base">
                                Our service may include paid subscriptions. You agree to pay all fees associated with your subscription 
                                in accordance with the pricing and payment terms presented to you.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">Fees are non-refundable except as required by law</li>
                                <li className="mb-2">We may change our fees with 30 days notice</li>
                                <li className="mb-2">Late payments may result in service suspension</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">6. Intellectual Property</h2>
                            <p className="text-muted lh-base">
                                The Billing Pro service and its original content, features, and functionality are owned by Billing Pro 
                                and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">7. Termination</h2>
                            <p className="text-muted lh-base">
                                We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
                                whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">8. Limitation of Liability</h2>
                            <p className="text-muted lh-base">
                                In no event shall Billing Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                                be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our service.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">9. Governing Law</h2>
                            <p className="text-muted lh-base">
                                These Terms shall be governed and construed in accordance with the laws of the United States, without 
                                regard to its conflict of law provisions.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">10. Changes to Terms</h2>
                            <p className="text-muted lh-base">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing 
                                to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </div>

                        <p className="mt-5 pt-3 border-top text-center text-muted">
                            For any questions regarding these Terms of Service, please contact us at{' '}
                            <a href="mailto:support@cybomb.com" className="text-primary text-decoration-none">
                                support@cybomb.com
                            </a>.
                        </p>
                    </Card.Body>
                </Card>
            </Container>

            <style>{`
                .legal-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
            `}</style>
        </div>
    );
};

export default TermsOfService;