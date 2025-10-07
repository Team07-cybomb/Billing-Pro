import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer py-4">
      <Container>
        <Row className="g-4">
          <Col lg={4}>
            <div className="d-flex align-items-center mb-3">
              <div className="logo-wrapper bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" aria-hidden="true">
                <Zap size={18} className="text-white" />
              </div>
              <h5 className="fw-bold text-white mb-0">Billing<span className="text-primary">Pro</span></h5>
            </div>
            <p className="small mb-0">The complete billing and inventory management solution for modern businesses.</p>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <h6 className="text-white fw-bold mb-3">Product</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/features" className="text-white-50 text-decoration-none">Features</a></li>
              <li className="mb-2"><a href="#pricing" className="text-white-50 text-decoration-none">Pricing</a></li>
              <li className="mb-2"><a href="#security" className="text-white-50 text-decoration-none">Security</a></li>
            </ul>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <h6 className="text-white fw-bold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#help" className="text-white-50 text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#contact" className="text-white-50 text-decoration-none">Contact Us</a></li>
              <li className="mb-2"><a href="#status" className="text-white-50 text-decoration-none">System Status</a></li>
            </ul>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <h6 className="text-white fw-bold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#about" className="text-white-50 text-decoration-none">About</a></li>
              <li className="mb-2"><a href="#careers" className="text-white-50 text-decoration-none">Careers</a></li>
              <li className="mb-2"><a href="#blog" className="text-white-50 text-decoration-none">Blog</a></li>
            </ul>
          </Col>
        </Row>

        <hr className="my-3" style={{borderColor: 'rgba(255,255,255,0.06)'}} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">
          <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} Cybomb Technologies. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="/privacy-policy" className="text-white-50 text-decoration-none">Privacy</a>
            <a href="/terms-of-services" className="text-white-50 text-decoration-none">Terms</a>
            <a href="/cookies-policy" className="text-white-50 text-decoration-none">Cookies</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;