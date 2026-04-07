import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/organisms/layout/Sidebar";
import Navbar from "../components/organisms/layout/Navbar";

export default function DashboardLayout() {
  const token = localStorage.getItem("token");
  
  // State untuk mengontrol Sidebar di tampilan Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    // Menggunakan h-screen dan overflow-hidden agar rapi
    <div className="h-screen flex bg-mosque-bg overflow-hidden relative">
      
      {/* Overlay Gelap: Selalu di-render, tapi opacity dan visibility diatur state agar transisinya smooth */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar menerima state dan fungsi tutup */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar menerima fungsi untuk toggle menu */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Konten utama bisa di-scroll */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}