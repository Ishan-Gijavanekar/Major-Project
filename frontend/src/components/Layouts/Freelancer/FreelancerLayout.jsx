import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./FreelancerNavbar";
import Sidebar from "./FreelancerSidebar";
import { SidebarProvider } from "../../useSidebar"; 

const FreelancerLayout = () => {
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

export default FreelancerLayout;
