import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, DollarSign, Users, TrendingUp, CheckCircle, Zap, 
  ClipboardList, Clock, Shield, ArrowRight, Play, BarChart3,
  Smartphone, Globe, Headphones, Database, Lock, Settings,
  Search, Filter, Download, Share2, Eye, Edit3, PieChart,
  CreditCard, Mail, MessageSquare, Bell, Calendar, Target
} from 'lucide-react';

// ---------- Custom Hooks ----------
const useInView = (ref, options = {}) => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options.threshold]);
  return inView;
};

// ---------- Styles ----------
const CustomStyles = () => (
  <style>{`
    .features-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }
    
    .floating-shape {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .feature-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    
    .feature-icon {
      transition: all 0.3s ease;
    }
    
    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .category-filter {
      transition: all 0.3s ease;
    }
    
    .category-filter.active {
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      color: white !important;
      transform: scale(1.05);
    }
    
    .tab-pane {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .comparison-table {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stats-counter {
      font-feature-settings: "tnum";
      font-variant-numeric: tabular-nums;
    }
    
    @media (max-width: 768px) {
      .feature-card {
        margin-bottom: 1.5rem;
      }
      
      .category-filters {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
      }
    }
  `}</style>
);

// ---------- Components ----------
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features = [], 
  badge, 
  badgeVariant = "primary",
  animationDelay = 0 
}) => {
  const cardRef = useRef();
  const inView = useInView(cardRef);
  
  return (
    <Card 
      ref={cardRef}
      className="feature-card shadow-sm border-0 h-100"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${animationDelay}ms`
      }}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="feature-icon-wrapper">
            <div 
              className="feature-icon rounded-3 p-3 mb-3"
              style={{
                background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.05))'
              }}
            >
              <Icon size={32} className="text-primary" />
            </div>
          </div>
          {badge && (
            <Badge bg={badgeVariant} className="fs-3 px-3 py-2">
              {badge}
            </Badge>
          )}
        </div>
        
        <Card.Title className="h5 fw-bold text-dark mb-3">
          {title}
        </Card.Title>
        
        <Card.Text className="text-muted mb-4">
          {description}
        </Card.Text>
        
        {features.length > 0 && (
          <ul className="list-unstyled mb-0">
            {features.map((feature, index) => (
              <li key={index} className="d-flex align-items-center mb-2">
                <CheckCircle size={16} className="text-success me-2 flex-shrink-0" />
                <span className="small text-muted">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

const CategoryFilter = ({ category, icon: Icon, isActive, onClick, count }) => (
  <Button
    variant={isActive ? "primary" : "outline-primary"}
    className="category-filter rounded-pill px-4 py-2 me-2 mb-2 d-flex align-items-center"
    onClick={onClick}
  >
    <Icon size={18} className="me-2" />
    {category}
    {count && (
      <Badge bg={isActive ? "light" : "primary"} text={isActive ? "dark" : "white"} className="ms-2">
        {count}
      </Badge>
    )}
  </Button>
);

const StatCard = ({ number, label, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * number));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, number, duration]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="fw-bold text-primary display-4 mb-2 stats-counter">
        {count}{suffix}
      </h3>
      <p className="text-muted mb-0 fw-medium">{label}</p>
    </div>
  );
};

// ---------- Main Component ----------
const FeaturesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const featuresData = {
    billing: [
      {
        icon: FileText,
        title: "Sequential Invoicing",
        description: "Automatically generate professional, date-based sequential invoice numbers for perfect tax compliance.",
        features: ["Auto-numbering", "Tax compliance", "Custom templates", "Batch processing"],
        badge: "New"
      },
      {
        icon: DollarSign,
        title: "Automated Tax Calculations",
        description: "Handle complex GST, CGST, and SGST calculations automatically with full compliance.",
        features: ["Multi-tax support", "Real-time calculations", "Audit trails", "Compliance reports"],
        badge: "Popular"
      },
      {
        icon: CreditCard,
        title: "Payment Processing",
        description: "Accept multiple payment methods with secure, PCI-compliant processing.",
        features: ["Multiple gateways", "Secure processing", "Auto-reconciliation", "Receipt generation"]
      }
    ],
    inventory: [
      {
        icon: ClipboardList,
        title: "Real-Time Stock Control",
        description: "Deduct stock automatically upon invoice creation, preventing overselling.",
        features: ["Real-time updates", "Low stock alerts", "Barcode support", "Stock history"],
        badge: "Hot"
      },
      {
        icon: Database,
        title: "Inventory Analytics",
        description: "Gain insights into your inventory performance with advanced analytics.",
        features: ["Sales trends", "Stock turnover", "Profit margins", "Forecasting"]
      },
      {
        icon: BarChart3,
        title: "Multi-Warehouse Management",
        description: "Manage inventory across multiple locations with centralized control.",
        features: ["Location tracking", "Transfer orders", "Stock balancing", "Regional pricing"]
      }
    ],
    customers: [
      {
        icon: Users,
        title: "Customer Management",
        description: "Manage multiple contact persons under the same organization seamlessly.",
        features: ["Contact management", "Organization hierarchy", "Communication history", "Customer portal"],
        badge: "Updated"
      },
      {
        icon: Mail,
        title: "Automated Communications",
        description: "Send automated invoices, reminders, and notifications to customers.",
        features: ["Email templates", "SMS notifications", "Auto-reminders", "Custom schedules"]
      },
      {
        icon: MessageSquare,
        title: "Customer Portal",
        description: "Provide customers with self-service access to their invoices and history.",
        features: ["Secure login", "Invoice history", "Payment portal", "Support tickets"]
      }
    ],
    security: [
      {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-level encryption and compliance to keep your financial data safe.",
        features: ["256-bit encryption", "GDPR compliance", "Access controls", "Audit logs"],
        badge: "Secure"
      },
      {
        icon: Lock,
        title: "Role-Based Access",
        description: "Control user permissions with granular role-based access controls.",
        features: ["Custom roles", "Permission sets", "Team management", "Activity monitoring"]
      },
      {
        icon: Settings,
        title: "Data Backup & Recovery",
        description: "Automatic backups and quick recovery options for business continuity.",
        features: ["Auto-backups", "Point-in-time recovery", "Export options", "Data migration"]
      }
    ]
  };

  const allFeatures = Object.values(featuresData).flat();
  const categories = [
    { key: 'all', label: 'All Features', icon: Zap, count: allFeatures.length },
    { key: 'billing', label: 'Billing', icon: FileText, count: featuresData.billing.length },
    { key: 'inventory', label: 'Inventory', icon: ClipboardList, count: featuresData.inventory.length },
    { key: 'customers', label: 'Customers', icon: Users, count: featuresData.customers.length },
    { key: 'security', label: 'Security', icon: Shield, count: featuresData.security.length }
  ];

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesCategory = activeCategory === 'all' || 
      Object.values(featuresData).some(category => category.includes(feature));
    const matchesSearch = !searchTerm || 
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-light">
      <CustomStyles />
      
      {/* Hero Section */}
      <section className="features-hero text-white py-6">
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="floating-shape position-absolute top-20 start-10 w-8 h-8 bg-white opacity-5 rounded-circle"></div>
          <div className="floating-shape position-absolute bottom-20 end-20 w-12 h-12 bg-white opacity-3 rounded-circle" style={{animationDelay: '2s'}}></div>
          <div className="floating-shape position-absolute top-40 end-10 w-6 h-6 bg-white opacity-7 rounded-circle" style={{animationDelay: '4s'}}></div>
        </div>
        
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={8} className="mx-auto text-center">
              <Badge bg="light" text="dark" className="mb-4 px-3 py-2 rounded-pill fw-normal">
                <Zap size={16} className="me-2" /> Powerful Features
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Everything You Need to <span className="gradient-text">Streamline</span> Your Business
              </h1>
              <p className="lead mb-5 opacity-90 fs-5">
                Discover how Billing Pro's comprehensive feature set can transform your billing, 
                inventory management, and customer relationships.
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button 
                  size="lg" 
                  variant="light" 
                  onClick={() => navigate('/login')}
                  className="fw-semibold rounded-pill px-5 py-3"
                >
                  Start Free Trial <ArrowRight size={18} className="ms-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-light" 
                  className="fw-semibold rounded-pill px-5 py-3"
                >
                  <Play size={18} className="me-2" /> Watch Demo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-6 bg-white">
        <Container>
          <Row className="g-5 text-center">
            <Col md={3} sm={6}>
              <StatCard number={25} suffix="+" label="Powerful Features" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard number={99.9} suffix="%" label="Uptime Reliability" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard number={50} suffix="%" label="Time Saved" />
            </Col>
            <Col md={3} sm={6}>
              <StatCard number={10000} suffix="+" label="Happy Customers" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Grid Section */}
      <section className="py-6 bg-light">
        <Container>
          {/* Search and Filters */}
          <Row className="mb-5">
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-dark mb-3">Explore Our Features</h2>
                <p className="text-muted lead">
                  Find exactly what you need with our comprehensive feature set
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="position-relative">
                  <Search size={20} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5 rounded-pill border-0 shadow-sm"
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Category Filters */}
              <div className="d-flex flex-wrap justify-content-center category-filters">
                {categories.map((category) => (
                  <CategoryFilter
                    key={category.key}
                    category={category.label}
                    icon={category.icon}
                    isActive={activeCategory === category.key}
                    onClick={() => setActiveCategory(category.key)}
                    count={category.count}
                  />
                ))}
              </div>
            </Col>
          </Row>

          {/* Features Grid */}
          <Row className="g-4">
            {filteredFeatures.map((feature, index) => (
              <Col key={index} lg={4} md={6}>
                <FeatureCard
                  {...feature}
                  animationDelay={index * 100}
                />
              </Col>
            ))}
          </Row>

          {/* No Results Message */}
          {filteredFeatures.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <Search size={64} className="text-muted mb-3" />
                <h4 className="text-muted">No features found</h4>
                <p className="text-muted">
                  Try adjusting your search terms or browse all categories
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Feature Comparison */}
      <section className="py-6 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">Compare Features</h2>
            <p className="text-muted lead">
              See how Billing Pro stacks up against traditional solutions
            </p>
          </div>
          
          <Row>
            <Col lg={10} className="mx-auto">
              <Card className="comparison-table border-0 shadow-lg">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th className="border-0 ps-4">Feature</th>
                          <th className="border-0 text-center">Billing Pro</th>
                          <th className="border-0 text-center">Traditional Software</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="ps-4 fw-medium">Real-time Inventory</td>
                          <td className="text-center"><CheckCircle size={20} className="text-success" /></td>
                          <td className="text-center"><div className="text-muted">—</div></td>
                        </tr>
                        <tr>
                          <td className="ps-4 fw-medium">Automated Tax Calculations</td>
                          <td className="text-center"><CheckCircle size={20} className="text-success" /></td>
                          <td className="text-center"><div className="text-muted">Manual</div></td>
                        </tr>
                        <tr>
                          <td className="ps-4 fw-medium">Multi-device Access</td>
                          <td className="text-center"><CheckCircle size={20} className="text-success" /></td>
                          <td className="text-center"><div className="text-muted">Limited</div></td>
                        </tr>
                        <tr>
                          <td className="ps-4 fw-medium">Automatic Backups</td>
                          <td className="text-center"><CheckCircle size={20} className="text-success" /></td>
                          <td className="text-center"><div className="text-muted">Manual</div></td>
                        </tr>
                        <tr>
                          <td className="ps-4 fw-medium">Customer Self-service</td>
                          <td className="text-center"><CheckCircle size={20} className="text-success" /></td>
                          <td className="text-center"><div className="text-muted">—</div></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-6 bg-dark text-white text-center">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-3">Ready to Experience These Features?</h2>
              <p className="lead mb-4 opacity-90">
                Join thousands of businesses already using Billing Pro to streamline their operations
              </p>
              <Button 
                size="lg" 
                variant="light" 
                onClick={() => navigate('/login')}
                className="fw-semibold rounded-pill px-5 py-3"
              >
                Start Your Free Trial <ArrowRight size={18} className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default FeaturesPage;