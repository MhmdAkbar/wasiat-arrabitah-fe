import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/organisms/layout/Sidebar";
import Navbar from "../components/organisms/layout/Navbar";

export default function DashboardLayout() {
  const token = localStorage.getItem("token");
  
  // State to control Sidebar on Mobile view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    // Using h-screen and overflow-hidden to keep it neat
    <div className="h-screen flex bg-mosque-bg overflow-hidden relative">
      
      {/* Dark Overlay: Always rendered, but opacity and visibility are controlled by state for smooth transition */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar receives state and close function */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar receives function to toggle menu */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main content is scrollable */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}