import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";

// NAVBAR Animation Variants
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A] 
        transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NAVBAR INNER */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <a href="/admin">
            <h1 className="text-[22px] text-white font-semibold tracking-tight">
              GigScape
              <span className="ml-2 text-[13px] text-gray-400">Admin</span>
            </h1>
          </a>

          {/* DESKTOP LOGOUT */}
          <div className="hidden md:flex">
            <motion.button
              onClick={handleLogout}
              disabled={isLoggingOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex items-center gap-2 px-4 py-2 
                text-[15px] text-gray-300
                hover:text-white 
                hover:bg-[#133A63] 
                transition-all duration-200
              "
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              )}
            </motion.button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={menuRef}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden bg-[#10263C] shadow-2xl z-50"
            >
              <div className="px-4 py-4">
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="
                    w-full flex items-center justify-center gap-2 
                    px-4 py-3 
                    text-[15px] text-gray-300 
                    hover:text-white hover:bg-[#133A63] 
                    transition-all duration-200
                  "
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
