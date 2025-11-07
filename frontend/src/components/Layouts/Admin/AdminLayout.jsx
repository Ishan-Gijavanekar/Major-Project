import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./AdminNavbar";
import Sidebar from "./AdminSidebar";
import { SidebarProvider } from "../../useSidebar"; 

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <Sidebar />
        <div className="flex-1 transition-all duration-300">
          <Navbar />
          <div className="mt-16 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
