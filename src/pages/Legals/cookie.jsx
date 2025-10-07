// src/pages/CookiePolicy.jsx
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
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
                        <Cookie size={48} className="mb-3" />
                        <h1 className="fw-bold display-5 mb-1">Cookie Policy</h1>
                        <p className="lead opacity-90">Last reviewed: October 2025</p>
                    </div>
                    
                    {/* Content Body */}
                    <Card.Body className="p-4 p-md-5">
                        <div className="mb-5">
                            <p className="text-muted lead">
                                This Cookie Policy explains how Billing Pro uses cookies and similar technologies to recognize you when 
                                you visit our application. It explains what these technologies are and why we use them.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">1. What are Cookies?</h2>
                            <p className="text-muted lh-base">
                                Cookies are small text files placed on your device by websites that you visit. They are widely used to make 
                                websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                            <p className="text-muted lh-base mt-3">
                                Cookies are typically classified as either "session cookies" which are deleted when you close your browser, 
                                or "persistent cookies" which remain until they expire or you delete them.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">2. How We Use Cookies</h2>
                            <p className="text-muted lh-base">
                                We use strictly necessary cookies for authentication and session management, and performance cookies to 
                                analyze user traffic and optimize application speed. We do not use advertising or targeting cookies.
                            </p>
                            
                            <div className="mt-4">
                                <h3 className="h5 fw-bold text-dark mb-3">Types of Cookies We Use:</h3>
                                
                                <div className="card mb-3 border-0 bg-light">
                                    <div className="card-body">
                                        <h4 className="h6 fw-bold text-primary mb-2">Essential Cookies</h4>
                                        <p className="text-muted small mb-0">
                                            These cookies are necessary for the website to function and cannot be switched off. 
                                            They are usually only set in response to actions made by you such as logging in or filling in forms.
                                        </p>
                                    </div>
                                </div>

                                <div className="card mb-3 border-0 bg-light">
                                    <div className="card-body">
                                        <h4 className="h6 fw-bold text-primary mb-2">Performance Cookies</h4>
                                        <p className="text-muted small mb-0">
                                            These cookies allow us to count visits and traffic sources so we can measure and improve 
                                            the performance of our site. They help us to know which pages are the most and least popular.
                                        </p>
                                    </div>
                                </div>

                                <div className="card border-0 bg-light">
                                    <div className="card-body">
                                        <h4 className="h6 fw-bold text-primary mb-2">Functionality Cookies</h4>
                                        <p className="text-muted small mb-0">
                                            These cookies enable the website to provide enhanced functionality and personalization. 
                                            They may be set by us or by third-party providers whose services we have added to our pages.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">3. Third-Party Cookies</h2>
                            <p className="text-muted lh-base">
                                In some special cases, we also use cookies provided by trusted third parties. The following section details 
                                which third-party cookies you might encounter through our site.
                            </p>
                            <ul className="text-muted lh-base mt-3">
                                <li className="mb-2">
                                    <strong>Analytics Cookies:</strong> We use Google Analytics to understand how you use our site
                                </li>
                                <li className="mb-2">
                                    <strong>Payment Processing:</strong> Cookies from payment processors to securely handle transactions
                                </li>
                                <li>
                                    <strong>Security Cookies:</strong> Cookies that help us monitor and prevent fraudulent activities
                                </li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">4. Managing Cookies</h2>
                            <p className="text-muted lh-base">
                                You can control and manage cookies in various ways. Most browsers allow you to refuse to accept cookies 
                                and to delete cookies already stored on your device. However, blocking essential cookies may affect the functionality of the service.
                            </p>
                            
                            <div className="mt-4">
                                <h3 className="h5 fw-bold text-dark mb-3">Browser Controls:</h3>
                                <ul className="text-muted lh-base">
                                    <li className="mb-2">
                                        <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                                    </li>
                                    <li className="mb-2">
                                        <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                                    </li>
                                    <li className="mb-2">
                                        <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                                    </li>
                                    <li>
                                        <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">5. Cookie Duration</h2>
                            <p className="text-muted lh-base">
                                The length of time a cookie will stay on your device depends on whether it is a "persistent" or "session" cookie. 
                                Session cookies will only stay on your device until you stop browsing. Persistent cookies stay on your device until they expire or are deleted.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="h4 fw-bold text-dark mb-3">6. Updates to This Policy</h2>
                            <p className="text-muted lh-base">
                                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our operations. 
                                We will post any changes on this page and update the "Last reviewed" date.
                            </p>
                        </div>

                        <p className="mt-5 pt-3 border-top text-center text-muted">
                            For any questions regarding our use of cookies, please contact us at{' '}
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
            `}</style>
        </div>
    );
};

export default CookiePolicy;