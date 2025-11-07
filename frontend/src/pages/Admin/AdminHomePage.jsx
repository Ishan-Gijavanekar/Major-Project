import React from 'react'
import { useSidebar } from "../../components/useSidebar";

const AdminHomePage = () => {
  const { isOpen: isSidebarOpen } = useSidebar();
  return (
    <div className={`min-h-screen bg-white transition-all duration-300 ${
        isSidebarOpen ? "ml-100" : "ml-20"
      }`}>
      <h1>admin homepage</h1>
    </div>
  )
}

export default AdminHomePage
