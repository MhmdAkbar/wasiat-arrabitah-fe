import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import TemplateManagement from "./pages/template/TemplateManagement";
import DocumentSubmission from "@/pages/submission/DocumentSubmission";
import MySubmissions from "./pages/submission/MySubmissions";
import ApprovalTasks from "./pages/submission/ApprovalTasks";
function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<TemplateManagement />} />
          <Route path="/submissions/new" element={<DocumentSubmission />} />
          <Route path="/submissions/my" element={<MySubmissions />} />
          <Route path="/submissions/tasks" element={<ApprovalTasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
