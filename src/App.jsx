// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Guards
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layouts/ProtectedRoute";

// Pages & Layouts
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import TemplateManagement from "./pages/template/TemplateManagement";
import DocumentSubmission from "@/pages/submission/DocumentSubmission";
import MySubmissions from "./pages/submission/MySubmissions";
import ApprovalTasks from "./pages/submission/ApprovalTasks";
import MyProfile from "./pages/dashboard/MyProfile";

function App() {
  return (
    // Wrap entire app to provide global auth state
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes: Accessible only with valid HTTP-Only Cookie Session */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/templates" element={<TemplateManagement />} />
              <Route path="/submissions/new" element={<DocumentSubmission />} />
              <Route path="/submissions/my" element={<MySubmissions />} />
              <Route path="/submissions/tasks" element={<ApprovalTasks />} />
              
              {/* Moved Register inside protected zone as per backend policy */}
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;