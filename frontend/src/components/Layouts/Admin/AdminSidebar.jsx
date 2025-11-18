import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
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
  FileText,
  Grid,
  Eye,
  UserCircle2
} from "lucide-react";
import { useSidebar } from "../../useSidebar";

const AdminSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (id) =>
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));

  const menuItems = [
    {
      id: "User",
      icon: <Users size={18} />,
      text: "User",
      children: [
        { to: "/admin/get-all-users", text: "Get All Users", icon: <Eye size={14} /> },
      ],
    },
    {
      id: "Category",
      icon: <FolderTree size={18} />,
      text: "Category",
      children: [
        { to: "/admin/get-all-categories", text: "Get All Category", icon: <Grid size={14} /> },
      ],
    },
    {
      id: "Jobs",
      icon: <Briefcase size={18} />,
      text: "Jobs",
      children: [{ to: "/admin/get-all-jobs", text: "All Jobs", icon: <Eye size={14} /> }],
    },
    {
      id: "Quiz",
      icon: <FileQuestion size={18} />,
      text: "Quiz",
      children: [{ to: "/admin/get-all-quiz", text: "Get All Quiz", icon: <Eye size={14} /> }],
    },
    {
      id: "Review",
      icon: <Star size={18} />,
      text: "Review & Rating",
      children: [{ to: "/admin/get-all-reviews", text: "Get All Ratings", icon: <Eye size={14} /> }],
    },
    {
      id: "Skills",
      icon: <Award size={18} />,
      text: "Skills",
      children: [{ to: "/admin/get-all-skill", text: "Get All Skills", icon: <Eye size={14} /> }],
    },
    {
      id: "Proposal",
      icon: <FileText size={18} />,
      text: "Proposal",
      children: [
        {
          to: "/admin/get-all-proposal",
          text: "Proposal Statistics",
          icon: <Eye size={14} />,
        },
      ],
    },
    { to: "/admin/profile", icon: <UserCircle2 size={18} />, text: "Profile" },
  ];

  return (
    <motion.div
      initial={{ width: 260 }}
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.25 }}
      className="
        fixed left-0 top-16 h-full z-50
        bg-[#0D1B2A]
        border-r border-[#10263C]
        text-gray-300
        shadow-xl
      "
    >
      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="
          absolute -right-3 top-4 p-1.5 
          bg-[#10263C] border border-[#1C3552]
          rounded-full text-gray-400 
          hover:text-white hover:bg-[#133A63]
          transition-all duration-200
        "
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Menu */}
      <nav className="mt-6 px-3 space-y-[2px]">
        {menuItems.map((item) =>
          item.children ? (
            <DropdownItem
              key={item.id}
              item={item}
              isOpen={isOpen}
              isExpanded={openMenus[item.id]}
              toggle={() => toggleMenu(item.id)}
              location={location}
            />
          ) : (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              text={item.text}
              isOpen={isOpen}
              active={location.pathname === item.to}
            />
          )
        )}
      </nav>
    </motion.div>
  );
};

/* DROPDOWN ITEM */
const DropdownItem = ({ item, isOpen, isExpanded, toggle, location }) => {
  const isActive = item.children.some((c) => c.to === location.pathname);

  return (
    <div>
      <button
        onClick={toggle}
        className={`
          flex items-center justify-between w-full px-4 py-2.5
          rounded-md text-[15px] group transition-all duration-150
          ${
            isActive
              ? "text-white bg-[#112A46] border-l-2 border-[#2D8CFF]"
              : "hover:bg-[#133A63]/40"
          }
        `}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {isOpen && (
            <span className={`${isActive ? "text-white" : "text-gray-300"}`}>
              {item.text}
            </span>
          )}
        </div>

        {isOpen && (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </button>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-10 mt-1 space-y-1"
          >
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md text-[14.5px]
                  ${
                    location.pathname === child.to
                      ? "text-[#2D8CFF]"
                      : "text-gray-400 hover:text-white hover:bg-[#133A63]/40"
                  }
                `}
              >
                {child.icon}
                {child.text}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* REGULAR LINK */
const SidebarLink = ({ to, icon, text, isOpen, active }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-md text-[15px]
        transition-all duration-150
        ${
          active
            ? "bg-[#112A46] text-white border-l-2 border-[#2D8CFF]"
            : "text-gray-300 hover:bg-[#133A63]/40 hover:text-white"
        }
      `}
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default AdminSidebar;
