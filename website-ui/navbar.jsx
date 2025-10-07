import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="site-header py-3 shadow-sm bg-white sticky-top" role="navigation">
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="logo-wrapper bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" aria-hidden="true">
              <Zap size={20} className="text-white" aria-hidden="true" />
            </div>
            <a href="/" className="h5 fw-bold text-dark mb-0 text-decoration-none" aria-label="Billing Pro homepage">
              Billing<span className="text-primary">Pro</span>
            </a>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline-primary" onClick={() => navigate('/login')} className="fw-semibold rounded-pill px-3 py-2" type="button">Sign In</Button>
            <Button variant="primary" onClick={() => navigate('/login')} className="fw-semibold rounded-pill px-3 py-2 gradient-btn" type="button">
              <Zap size={16} className="me-2" aria-hidden="true" /> Get Started
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;