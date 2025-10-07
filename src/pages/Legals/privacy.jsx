// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="font-sans min-h-screen bg-light py-5">
            <Container className="my-5">
                <Button 
                    as={Link} 
                    to="/legal" 
                    variant="outline-primary" 
                    className="mb-4 rounded-pill d-inline-flex align-items-center"
                >
                    <ArrowLeft size={18} className="me-2" />
                    Back to Legal Documents
                </Button>

                <Card className="shadow-lg border-0">
                    {/* Header */}
                    <div className="legal-header text-white text-center py-5 rounded-top-3">
                        <Shield size={48} className="mb-3" />
                        <h1 className="fw-bold display-5 mb-1">Privacy Policy</h1>
                        <p className="lead opacity-90">Last updated: October 2025</p>
                    </div>
                    
                    {/* Content Body */}
                    <Card.Body className="p-4 p-md-5">
                        <div className="mb-5">
                            <p className="text-muted lead">
                                At Billing Pro, we are committed to protecting your privacy and ensuring the security of your personal information. 
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">1. Information We Collect</h2>
                            <p className="text-muted lh-base">
                                We collect non-personal information about how you use the application, such as features accessed and session duration. 
                                We only collect personal data (name, email, business information) when you register for an account and use our billing services.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">
                                    <strong>Account Information:</strong> Name, email address, business details, and contact information
                                </li>
                                <li className="mb-2">
                                    <strong>Billing Data:</strong> Invoice data, customer information, product details, and transaction records
                                </li>
                                <li className="mb-2">
                                    <strong>Usage Data:</strong> Features used, session duration, and application performance metrics
                                </li>
                                <li>
                                    <strong>Technical Data:</strong> IP address, browser type, device information, and operating system
                                </li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">2. How We Use Your Information</h2>
                            <p className="text-muted lh-base">
                                Your information is used solely to provide and improve the Billing Pro service, process payments, 
                                and communicate critical updates regarding your account or security. We do not sell your data to third parties.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">To provide and maintain our billing and inventory management services</li>
                                <li className="mb-2">To process transactions and generate invoices for your business</li>
                                <li className="mb-2">To send important notifications about service updates and security</li>
                                <li className="mb-2">To improve our application and develop new features</li>
                                <li>To comply with legal obligations and prevent fraudulent activities</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">3. Data Security</h2>
                            <p className="text-muted lh-base">
                                We implement industry-standard security measures, including 256-bit encryption, to protect your data 
                                from unauthorized access or disclosure. All financial data is handled by PCI-compliant third-party processors.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">End-to-end encryption for all data transmission</li>
                                <li className="mb-2">Regular security audits and vulnerability assessments</li>
                                <li className="mb-2">Secure data centers with 24/7 monitoring</li>
                                <li>Employee training on data protection and privacy practices</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">4. Data Sharing and Disclosure</h2>
                            <p className="text-muted lh-base">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">
                                    <strong>Service Providers:</strong> With trusted third parties who assist us in operating our website and services
                                </li>
                                <li className="mb-2">
                                    <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                                </li>
                                <li>
                                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                                </li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">5. Your Rights</h2>
                            <p className="text-muted lh-base">
                                You have the right to access, correct, or delete your personal information. You can also object to processing, 
                                request data portability, and withdraw consent at any time.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">Access and download your personal data</li>
                                <li className="mb-2">Correct inaccurate or incomplete information</li>
                                <li className="mb-2">Delete your account and associated data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">6. Data Retention</h2>
                            <p className="text-muted lh-base">
                                We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
                                described in this policy. When you delete your account, we will remove your personal data from our active systems.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">7. International Data Transfers</h2>
                            <p className="text-muted lh-base">
                                Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place 
                                to protect your data in accordance with this Privacy Policy and applicable laws.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">8. Changes to This Policy</h2>
                            <p className="text-muted lh-base">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                                Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                        </div>

                        <p className="mt-5 pt-3 border-top text-center text-muted">
                            For any questions regarding this Privacy Policy, please contact our legal department at{' '}
                            <a href="mailto:privacy@billingpro.com" className="text-primary text-decoration-none">
                                privacy@billingpro.com
                            </a>.
                        </p>
                    </Card.Body>
                </Card>
            </Container>

            <style>{`
                .legal-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .icon-wrapper {
                    width: 70px;
                    height: 70px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;