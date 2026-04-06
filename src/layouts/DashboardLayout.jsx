import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/organisms/layout/Sidebar";
import Navbar from "../components/organisms/layout/Navbar";

export default function DashboardLayout() {
  const token = localStorage.getItem("token");

  // Proteksi Route Dasar
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-mosque-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1 p-8">
          <Outlet /> {/* Akan me-render konten Dashboard di sini */}
        </main>
      </div>
    </div>
  );
}
