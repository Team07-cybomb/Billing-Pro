import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Building,
  Archive,
  Clock,
  HelpCircle,
  UserCog,
} from "lucide-react";

// MOCK: Replacing the missing "../context/AuthContext" for compilation.
// You must replace this function with your actual useAuth hook when running locally.
const useAuth = () => {
  // Mock User data for demonstration (set role to "admin" to see all links)
  const user = { username: "Admin User", role: "admin" }; 
  const logout = () => {
    console.log("Mock Logout called. Navigating to /login.");
    // In a real app, this would clear authentication state.
  };
  return { user, logout };
};

const Navigation = ({ children }) => {
  // Use the mock hook here for successful compilation
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Core menu items (for staff + admin)
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/operations", label: "Operations", icon: UserCog },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/invoices", label: "Invoices", icon: FileText },
    { path: "/products", label: "Products", icon: Package },
    { path: "/inventory", label: "Inventory", icon: Archive },
    { path: "/history", label: "History", icon: Clock },
    { path: "/support", label: "Support", icon: HelpCircle },
    // Adding extra items 
  //   { path: "/extra1", label: "Extra Link 1", icon: Users },
  //   { path: "/extra2", label: "Extra Link 2", icon: FileText },
  //   { path: "/extra3", label: "Extra Link 3", icon: Package },
  //   { path: "/extra4", label: "Extra Link 4", icon: Archive },
  //   { path: "/extra5", label: "Extra Link 5", icon: Clock },
   ];

  // Admin-only items
  const adminItems = [
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  // Fix: Ensure comparison uses the input path argument
  const isActiveLink = (path) => location.pathname.toLowerCase() === path.toLowerCase(); 

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {user && (
        <div
          className="bg-dark text-white vh-100 d-flex flex-column position-fixed"
          style={{ width: "260px", zIndex: 1000 }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px" }}
              >
                <Building size={20} className="text-white" />
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-white">Billing Pro</h5>
                <small className="text-white-emphasis">Business Suite</small>
              </div>
            </div>
          </div>

          {/* Navigation Menu (Scrollable area) */}
          {/* Added navigation-scroll-area class */}
          <nav className="p-3 flex-grow-1 overflow-auto navigation-scroll-area">
            <div className="d-flex flex-column gap-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActiveLink(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`d-flex align-items-center gap-3 text-decoration-none p-3 rounded-3 transition-all ${
                      active
                        ? "bg-primary text-white shadow-sm"
                        : "text-white-emphasis hover-custom"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className={active ? "text-white" : "text-white-emphasis"}
                    />
                    <span className="fw-medium">{item.label}</span>
                    {active && (
                      <ChevronRight size={16} className="ms-auto text-white" />
                    )}
                  </Link>
                );
              })}

              {/* Admin only items */}
              {user.role === "admin" &&
                adminItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActiveLink(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`d-flex align-items-center gap-3 text-decoration-none p-3 rounded-3 transition-all ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-white-emphasis hover-custom"
                      }`}
                    >
                      <IconComponent
                        size={20}
                        className={
                          active ? "text-white" : "text-white-emphasis"
                        }
                      />
                      <span className="fw-medium">{item.label}</span>
                      {active && (
                        <ChevronRight
                          size={16}
                          className="ms-auto text-white"
                        />
                      )}
                    </Link>
                  );
                })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-top border-secondary mt-auto">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div
                  className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "36px", height: "36px" }}
                >
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-white fw-semibold small">
                    {user.username}
                  </div>
                  <div className="text-white-emphasis small text-capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm d-flex align-items-center"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: user ? "260px" : "0" }}
      >
        <div className="p-4 bg-light min-vh-100">{children}</div>
      </div>

      {/* Custom CSS for hover and scrollbar hiding */}
      <style jsx>{`
        .hover-custom:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          transform: translateX(4px);
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }

        /* ---------------------------------- */
        /* CSS to Hide Scrollbar (Cross-Browser) */
        /* ---------------------------------- */

        /* Hide scrollbar for Chrome, Safari, and Opera */
        .navigation-scroll-area::-webkit-scrollbar {
          display: none;
          width: 0 !important; /* Ensures space is also removed */
          height: 0 !important;
        }

        /* Hide scrollbar for IE and Edge */
        .navigation-scroll-area {
          -ms-overflow-style: none; /* IE and Edge */
        }

        /* Hide scrollbar for Firefox */
        .navigation-scroll-area {
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Navigation;
