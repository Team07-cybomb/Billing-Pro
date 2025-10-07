import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FileText, DollarSign, Users, TrendingUp, CheckCircle,
  Zap, ClipboardList, Clock, Shield, ArrowRight, Star, Play
} from 'lucide-react';



// ---------- Utility hooks ----------
function useInView(ref, { root = null, rootMargin = '0px', threshold = 0.2 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) setInView(true); });
      },
      { root, rootMargin, threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold]);
  return inView;
}

function AnimatedCounter({ target, suffix = '', duration = 1500 }) {
  const [value, setValue] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const from = 0;
    const to = Number(target);
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * (to - from) + from));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="text-center" role="status" aria-live="polite">
      <h3 className="fw-bold text-primary display-6 mb-1">{value}{suffix}</h3>
    </div>
  );
}

// ---------- Styles (kept local for quick integration) ----------
const CustomStyles = () => (
  <style>{`
    /* Resets & base */
    :root {
      --primary-500: #667eea;
      --primary-700: #5a6fd8;
      --accent-700: #764ba2;
      --muted: #6c757d;
    }
    html { scroll-behavior: smooth; }
    .min-h-screen { min-height: 100vh; }

    /* Header improvements */
    header.site-header { z-index: 1050; backdrop-filter: blur(6px); }
    .logo-wrapper { width: 44px; height: 44px; }

    /* Buttons */
    .gradient-btn { background: linear-gradient(135deg, var(--primary-500), var(--accent-700)); border: none; }
    .gradient-btn:focus { box-shadow: 0 0 0 0.25rem rgba(102,126,234,0.25); }
    .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.12); }

    /* Feature card */
    .feature-card { border-radius: 12px; transition: transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .28s; }
    .feature-card:hover { transform: translateY(-8px); box-shadow: 0 18px 40px rgba(20,20,40,0.12); }
    .icon-wrapper { width: 64px; height: 64px; border-radius: 12px; display:flex; align-items:center; justify-content:center; }

    /* Mockup */
    .hero-dashboard-mockup { transform: perspective(900px) rotateY(-8deg) rotateX(2deg); transition: transform .5s; }
    .hero-dashboard-mockup:hover { transform: perspective(900px) rotateY(-3deg) rotateX(0deg); }

    /* Fade-in animations */
    .fade-section { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
    .fade-section.in-view { opacity: 1; transform: translateY(0); }

    /* Accessibility & small tweaks */
    .text-white-50 { color: rgba(255,255,255,0.8) !important; }
    .bg-pattern { background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px; }

    /* Footer */
    footer.site-footer { background: #0f1724; color: rgba(255,255,255,0.85); }
    footer.site-footer a { color: rgba(255,255,255,0.7); }

    /* Responsive tweaks */
    @media (max-width: 991.98px) {
      .hero-dashboard-mockup { transform: none; }
    }

  `}</style>
);

// ---------- Small reusable components ----------
const FeatureCard = ({ icon: Icon, title, description, badge }) => (
  <Card className="feature-card shadow-sm border-0 h-100">
    <Card.Body className="text-center p-4 position-relative">
      {badge && (
        <Badge bg="primary" pill className="position-absolute top-0 start-50 translate-middle px-3 py-2">{badge}</Badge>
      )}
      <div className="icon-wrapper bg-gradient rounded-3 mb-3 mx-auto" style={{background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.08))'}}>
        <Icon size={28} className="text-primary" aria-hidden="true" />
      </div>
      <Card.Title className="fw-bold h5 mb-2 text-dark">{title}</Card.Title>
      <Card.Text className="text-muted small lh-base">{description}</Card.Text>
    </Card.Body>
  </Card>
);

const StatCard = ({ number, label, suffix }) => (
  <div className="text-center" role="contentinfo">
    <h3 className="fw-bold text-primary display-6 mb-1">{number}{suffix}</h3>
    <p className="text-muted small mb-0">{label}</p>
  </div>
);

// ---------- Main component ----------
const Homepage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef();
  const heroRef = useRef();
  const featuresInView = useInView(featuresRef, { threshold: 0.15 });
  const heroInView = useInView(heroRef, { threshold: 0.2 });

  // small helper to handle keyboard activation on hero primary CTA
  const handlePrimaryCTA = () => navigate('/login');

  return (
    <div className="font-sans min-h-screen bg-light">
      <CustomStyles />

      {/* Header */}
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

      {/* Hero */}
      <section ref={heroRef} className={`py-5 position-relative`} style={{ background: 'linear-gradient(135deg,#667eea 0%, #764ba2 100%)' }}>
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-pattern opacity-10" aria-hidden="true"></div>
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col lg={6} className="text-white">
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 rounded-pill fw-normal">
                <TrendingUp size={16} className="me-2" aria-hidden="true" /> Trusted by 10,000+ Businesses
              </Badge>
              <h1 className="display-5 fw-bold mb-3">Streamline Your Invoicing & Inventory Management</h1>
              <p className="lead mb-4 opacity-90">Billing Pro automates billing, keeps inventory accurate in real-time, and secures customer data with enterprise-grade safeguards.</p>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <Button size="lg" onClick={handlePrimaryCTA} className="fw-semibold rounded-pill px-4 py-2 shadow-sm" aria-label="Start free trial">Start Free Trial <ArrowRight size={16} className="ms-2" aria-hidden="true" /></Button>
                <Button variant="outline-light" size="lg" className="fw-semibold rounded-pill px-4 py-2 btn-ghost" aria-label="Watch demo"><Play size={16} className="me-2" aria-hidden="true" /> Watch Demo</Button>
              </div>

              <div className="mt-4 d-flex align-items-center small opacity-85">
                <div className="d-flex me-3" aria-hidden="true">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={16} className="text-warning" />)}
                </div>
                <span>Rated 4.9/5 by 2,500+ customers</span>
              </div>
            </Col>

            <Col lg={6} className="text-center d-none d-lg-block">
              <div className="hero-dashboard-mockup mt-4" aria-hidden="true">
                <div className="mockup-wrapper bg-white rounded-4 shadow p-3 d-inline-block" style={{maxWidth: 380}}>
                  <div className="bg-light rounded-3 p-3 border">
                    <div className="d-flex gap-2 mb-3">
                      <div className="bg-danger rounded-circle" style={{width: 12, height: 12}}></div>
                      <div className="bg-warning rounded-circle" style={{width: 12, height: 12}}></div>
                      <div className="bg-success rounded-circle" style={{width: 12, height: 12}}></div>
                    </div>
                    <div className="bg-white rounded-2 border p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Invoice #06102025-001</span>
                        <Badge bg="success" className="px-2">Paid</Badge>
                      </div>
                      <div className="text-start">
                        <h6 className="fw-bold mb-1">Acme Corporation</h6>
                        <p className="text-muted small mb-0">$1,250.00 • Due Jan 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats */}
      <section className={`py-5 bg-white ${heroInView ? 'fade-section in-view' : 'fade-section'}`} aria-labelledby="stats-heading">
        <Container>
          <h2 id="stats-heading" className="visually-hidden">Key Statistics</h2>
          <Row className="g-4 text-center">
            <Col md={3} sm={6}><AnimatedCounter target={99.9} suffix="%" duration={1200} /><p className="text-muted small mb-0">Uptime Reliability</p></Col>
            <Col md={3} sm={6}><AnimatedCounter target={50} suffix="%" duration={1200} /><p className="text-muted small mb-0">Faster Invoicing</p></Col>
            <Col md={3} sm={6}><AnimatedCounter target={10000} suffix="+" duration={1400} /><p className="text-muted small mb-0">Happy Customers</p></Col>
            <Col md={3} sm={6}><AnimatedCounter target={24} suffix="/7" duration={1000} /><p className="text-muted small mb-0">Support Available</p></Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className={`py-5 bg-light`} ref={featuresRef}>
        <Container>
          <div className={`text-center mb-4 ${featuresInView ? 'fade-section in-view' : 'fade-section'}`}>
            <h2 className="h3 fw-bold text-dark mb-2">Enterprise-Grade Features</h2>
            <p className="text-muted mx-auto" style={{maxWidth: 720}}>Everything you need to manage your billing and inventory efficiently.</p>
          </div>

          <Row xs={1} md={2} lg={4} className="g-4">
            <Col>
              <FeatureCard
                icon={FileText}
                title="Sequential Invoicing"
                description="Automatically generate date-based sequential invoice numbers for tax compliance and easy auditing."
                badge="New"
              />
            </Col>
            <Col>
              <FeatureCard icon={ClipboardList} title="Real-Time Stock Control" description="Deduct stock automatically upon invoice creation to prevent overselling." />
            </Col>
            <Col>
              <FeatureCard icon={Users} title="Customer Management" description="Manage multiple contact persons under a single organization for enterprise workflows." />
            </Col>
            <Col>
              <FeatureCard icon={DollarSign} title="Automated Tax Calculations" description="Handle complex GST/CGST/SGST calculations automatically with audit trails." />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Value Proposition */}
      <section className={`py-5 bg-white` }>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="h4 fw-bold text-dark mb-3">Built for Modern Businesses</h2>
              <div className="d-grid gap-3">
                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{width:48,height:48}}>
                    <CheckCircle size={18} className="text-success" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Instant Setup</h6>
                    <p className="text-muted small mb-0">Start within minutes — intuitive onboarding and prebuilt templates.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{width:48,height:48}}>
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Save Time & Resources</h6>
                    <p className="text-muted small mb-0">Automate repetitive tasks and reduce manual effort.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="icon-wrapper bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{width:48,height:48}}>
                    <Shield size={18} className="text-warning" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Enterprise Security</h6>
                    <p className="text-muted small mb-0">Bank-level encryption and strict access controls.</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="shadow border-0 overflow-hidden">
                <Card.Body className="p-0">
                  <div className="bg-primary text-white p-4 text-center">
                    <h4 className="fw-bold mb-1">Ready to Transform Your Business?</h4>
                    <p className="mb-0 opacity-90">Start your free 14-day trial</p>
                  </div>
                  <div className="p-4">
                    <div className="d-grid gap-2 mb-3">
                      <div className="d-flex align-items-center">
                        <CheckCircle size={18} className="text-success me-2" /> No credit card required
                      </div>
                      <div className="d-flex align-items-center">
                        <CheckCircle size={18} className="text-success me-2" /> Full access to all features
                      </div>
                      <div className="d-flex align-items-center">
                        <CheckCircle size={18} className="text-success me-2" /> Free onboarding support
                      </div>
                    </div>
                    <Button variant="primary" size="lg" onClick={() => navigate('/login')} className="w-100 fw-semibold py-2 gradient-btn">Start Your Free Trial</Button>
                    <p className="text-center text-muted small mt-2 mb-0">Full access for 14 days • Cancel anytime</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-4 bg-dark text-white text-center">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h2 className="h4 fw-bold mb-2">Start Streamlining Your Business Today</h2>
              <p className="lead mb-3 opacity-90">Join thousands of businesses that trust Billing Pro.</p>
              <Button size="lg" variant="light" onClick={() => navigate('/login')} className="fw-semibold rounded-pill px-4 py-2">Get Started Free <ArrowRight size={16} className="ms-2" /></Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
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
                <li className="mb-2"><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
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
            <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} Billing Pro. All rights reserved.</p>
            <div className="d-flex gap-3">
              <a href="#privacy" className="text-white-50 text-decoration-none">Privacy</a>
              <a href="#terms" className="text-white-50 text-decoration-none">Terms</a>
              <a href="#cookies" className="text-white-50 text-decoration-none">Cookies</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Homepage;
