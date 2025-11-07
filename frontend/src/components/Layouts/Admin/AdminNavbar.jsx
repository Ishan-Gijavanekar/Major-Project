
import { useState } from "react"; 
import { motion } from "framer-motion"; 
import { Menu, X, User } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useAuthStore } from "../../../stores/authStore"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const { logout, isLoading } = useAuthStore(); // Destructure logout and isLoading from authStore
  const navigate = useNavigate(); // Use navigate from react-router-dom

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-200 to-emerald-300 text-transparent bg-clip-text">
                GiGScApE(admin)
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/homepage/feilds">Home</NavLink>
                <NavLink to="/homepage/about">About</NavLink>
                <NavLink to="/homepage/services">Services</NavLink>
                <NavLink to="/homepage/contact">Contact</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              disabled={isLoading}
            >
              <User className="inline-block w-5 h-5 mr-2" />
              {isLoading ? "Logging out..." : "Logout"}
            </motion.button>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/homepage/feilds" mobile>
              Home
            </NavLink>
            <NavLink to="/homepage/about" mobile>
              About
            </NavLink>
            <NavLink to="/homepage/services" mobile>
              Services
            </NavLink>
            <NavLink to="/homepage/contact" mobile>
              Contact
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              disabled={isLoading}
            >
              <User className="inline-block w-5 h-5 mr-2" />
              {isLoading ? "Logging out..." : "Logout"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, mobile = false }) => (
  <Link
    to={to}
    className={`${
      mobile ? "block" : "inline-block"
    } px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out`}
  >
    {children}
  </Link>
);

export default Navbar;
