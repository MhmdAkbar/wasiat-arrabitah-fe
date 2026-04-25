// src/layouts/DashboardLayout.jsx
import { useState } from "react";
// Removed Navigate; routing security is now handled by ProtectedRoute
import { Outlet } from "react-router-dom"; 
import Sidebar from "../components/organisms/layout/Sidebar";
import Navbar from "../components/organisms/layout/Navbar";

export default function DashboardLayout() {
  // State to control Sidebar on Mobile view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pure UI component, no auth checks needed here anymore

  return (
    <div className="h-screen flex bg-mosque-bg overflow-hidden relative">
      {/* Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}