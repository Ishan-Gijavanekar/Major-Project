import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  FileText,
  ClipboardList,
  Star,
  Wallet,
  Receipt,
  MessagesSquare,
  User,
  Eye,
} from "lucide-react";
import { useSidebar } from "../../useSidebar";

const ClientSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.3 } },
    closed: { width: "60px", transition: { duration: 0.3 } },
  };

  // Updated menu with proper icons
  const menuItems = [
    {
      id: "Jobs",
      icon: <Briefcase />,
      text: "Jobs",
      children: [
        {
          to: "/client/get-all-jobs",
          icon: <Briefcase size={16} />,
          text: "All Jobs",
        },
      ],
    },
    {
      id: "Contract",
      icon: <FileText />,
      text: "Contract",
      children: [
        {
          to: "/client/get-all-milestone",
          icon: <FileText size={16} />,
          text: "All Contracts",
        },
      ],
    },
    {
      id: "Proposal",
      icon: <ClipboardList />,
      text: "Proposal",
      children: [
        {
          to: "/client/get-all-proposal",
          icon: <Eye size={16} />,
          text: "View Proposals",
        },
      ],
    },
    {
      id: "Review",
      icon: <Star />,
      text: "Reviews",
      children: [
        {
          to: "/client/get-all-reviews",
          icon: <Star size={16} />,
          text: "Client Reviews",
        },
      ],
    },
    {
      id: "Wallet",
      icon: <Wallet />,
      text: "Wallet",
      children: [
        {
          to: "/client/wallet-details",
          icon: <Wallet size={16} />,
          text: "Wallet Details",
        },
      ],
    },
    {
      id: "Transaction",
      icon: <Receipt />,
      text: "Transaction",
      children: [
        {
          to: "/client/transaction-details",
          icon: <Receipt size={16} />,
          text: "All Transactions",
        },
      ],
    },

    // Single menu items
    { to: "/client/chat-app", icon: <MessagesSquare />, text: "Chat" },
    { to: "/client/profile", icon: <User />, text: "Profile" },
  ];

  return (
    <motion.div
      className="fixed left-0 top-16 h-full bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl text-white overflow-y-auto"
      initial="open"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      style={{ zIndex: 40 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-black rounded-full p-1 hover:bg-gray-700 transition-colors"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <nav className="flex flex-col py-4 mt-8">
        {menuItems.map((item) =>
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
        )}
      </nav>
    </motion.div>
  );
};

const SidebarDropdown = ({ item, isOpen, isExpanded, onToggle }) => {
  const linkTextVariants = {
    open: { opacity: 1, display: "inline-block", transition: { delay: 0.2 } },
    closed: { opacity: 0, display: "none", transition: { duration: 0.1 } },
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
            animate={isOpen ? "open" : "closed"}
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
            animate={{ height: "auto", opacity: 1 }}
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
    open: { opacity: 1, display: "inline-block", transition: { delay: 0.2 } },
    closed: { opacity: 0, display: "none", transition: { duration: 0.1 } },
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
        animate={isOpen ? "open" : "closed"}
      >
        {text}
      </motion.span>
    </Link>
  );
};

export default ClientSidebar;
