import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";

/**
 * Professional Admin Navbar Component
 * Features:
 * - Full accessibility support (ARIA labels, keyboard navigation)
 * - Error handling and loading states
 * - Click outside to close mobile menu
 * - Escape key to close mobile menu
 * - Active route highlighting
 * - Smooth animations and transitions
 * - Performance optimizations
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // In production, you might want to show a toast notification here
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, navigate]);

  const isLogoutDisabled = isLoading || isLoggingOut;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Subtle Professional Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-slate-700/20 to-slate-800/20 pointer-events-none" />
      
      {/* Animated Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg transition-all"
              aria-label="GigScape Admin Dashboard - Home"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
                  className="relative w-10 h-10 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-lg flex items-center justify-center border border-slate-600/50 shadow-lg group-hover:shadow-xl group-hover:border-slate-500/70 transition-all duration-300"
                >
                  <Shield className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200" />
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-600/0 to-slate-600/0 group-hover:from-slate-600/20 group-hover:to-slate-600/0 transition-all duration-300" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white tracking-tight group-hover:text-slate-100 transition-colors duration-200">
                    GigScape
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase group-hover:text-slate-300 transition-colors duration-200">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLogoutDisabled}
              className="px-5 py-2.5 rounded-lg font-medium bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 text-slate-200 hover:text-white border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Logout from admin dashboard"
              aria-busy={isLogoutDisabled}
            >
              {isLogoutDisabled ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              ref={buttonRef}
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 active:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl relative z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="px-4 pt-4 pb-3 space-y-1">
                <NavLink
                  to="/homepage/feilds"
                  mobile
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/homepage/about"
                  mobile
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/homepage/services"
                  mobile
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </NavLink>
                <NavLink
                  to="/homepage/contact"
                  mobile
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </NavLink>
              </div>

              <div className="pt-4 pb-4 px-4 border-t border-slate-700/50">
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLogoutDisabled}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 text-slate-200 hover:text-white border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Logout from admin dashboard"
                  aria-busy={isLogoutDisabled}
                >
                  {isLogoutDisabled ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * Navigation Link Component
 * Features:
 * - Active route highlighting
 * - Smooth hover transitions
 * - Accessibility support
 */
const NavLink = ({ to, children, mobile = false, currentPath, onClick }) => {
  const isActive = currentPath === to || currentPath.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        ${mobile ? "block" : "inline-block"}
        px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "text-white bg-slate-800/80 border border-slate-600/50 shadow-sm"
            : "text-slate-300 hover:text-white hover:bg-slate-800/60"
        }
        focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
        active:scale-[0.98]
      `}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="relative">
        {children}
        {isActive && (
          <motion.span
            layoutId="activeIndicator"
            className="absolute left-0 right-0 bottom-0 h-0.5 bg-slate-400 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </span>
    </Link>
  );
};

export default Navbar;