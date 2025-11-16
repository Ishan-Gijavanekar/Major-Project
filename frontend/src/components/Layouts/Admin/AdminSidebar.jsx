import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Users,
  FolderTree,
  Briefcase,
  FileQuestion,
  Star,
  Award,
  DollarSign,
  FileText,
  Grid,
  Eye
} from 'lucide-react';
import { useSidebar } from '../../useSidebar';

const AdminSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '60px', transition: { duration: 0.3 } }
  };

 
  const menuItems = [
    {
      id: 'User',
      icon: <Users />,
      text: 'User',
      children: [
        { to: '/admin/get-all-users', icon: <Eye size={16} />, text: 'Get All Users' }
      ]
    },
    {
      id: 'Category',
      icon: <FolderTree />,
      text: 'Category',
      children: [
        { to: '/admin/get-all-categories', icon: <Grid size={16} />, text: 'Get All Category' },
      ]
    },
    {
      id: 'Jobs',
      icon: <Briefcase />,
      text: 'Jobs',
      children: [
        { to: '/admin/get-all-jobs', icon: <Eye size={16} />, text: 'All Jobs' },
      ]
    },
    {
      id: 'Quiz',
      icon: <FileQuestion />,
      text: 'Quiz',
      children: [
        { to: '/admin/get-all-quiz', icon: <Eye size={16} />, text: 'Get All Quiz' },
      ]
    },
    {
      id: 'Review and Rating',
      icon: <Star />,
      text: 'Review and Rating',
      children: [
        { to: '/admin/get-all-reviews', icon: <Eye size={16} />, text: 'Get All Ratings' },
      ]
    },
    {
      id: 'Skills',
      icon: <Award />,
      text: 'Skills',
      children: [
        { to: '/admin/get-all-skill', icon: <Eye size={16} />, text: 'Get All Skills' },
        
      ]
    },
    {
      id: 'Proposal',
      icon: <FileText />,
      text: 'Proposal',
      children: [
        { to: '/admin/get-all-proposal', icon: <Eye size={16} />, text: 'Proposal Statistics'},
      ]
    },
    { to: "/admin/profile", icon: <Eye size={16} />, text: "Profile" },
    
    
  ];

  return (
    <motion.div
      className="fixed left-0 top-16 h-full bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl text-white overflow-y-auto"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      style={{ zIndex: 40 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 shadow-lg border-2 border-gray-600 transition-all duration-200 hover:scale-110"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <ChevronLeft size={18} className="text-white" /> : <ChevronRight size={18} className="text-white" />}
      </button>
      
      <nav className="flex flex-col py-4 mt-8">
        {menuItems.map((item) => (
          item.children ? (
            <SidebarDropdown
              key={item.id}
              item={item}
              isOpen={isOpen}
              isExpanded={openMenus[item.id]}
              onToggle={() => toggleMenu(item.id)}
            />
          ) : (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              text={item.text}
              isOpen={isOpen}
            />
          )
        ))}
      </nav>
    </motion.div>
  );
};

const SidebarDropdown = ({ item, isOpen, isExpanded, onToggle }) => {
  const linkTextVariants = {
    open: { opacity: 1, display: 'inline-block', transition: { delay: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.1 } }
  };

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-150 ease-in-out"
      >
        <div className="flex items-center">
          <span className="inline-block">{item.icon}</span>
          <motion.span
            className="ml-4 text-sm font-medium"
            variants={linkTextVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
          >
            {item.text}
          </motion.span>
        </div>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.span>
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className="flex items-center px-4 py-2 pl-12 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition duration-150 ease-in-out text-sm"
              >
                <span className="inline-block mr-3">{child.icon}</span>
                <span>{child.text}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, isOpen }) => {
  const linkTextVariants = {
    open: { opacity: 1, display: 'inline-block', transition: { delay: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.1 } }
  };

  return (
    <Link
      to={to}
      className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-150 ease-in-out mb-1"
    >
      <span className="inline-block">{icon}</span>
      <motion.span
        className="ml-4 text-sm font-medium"
        variants={linkTextVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        {text}
      </motion.span>
    </Link>
  );
};

export default AdminSidebar;