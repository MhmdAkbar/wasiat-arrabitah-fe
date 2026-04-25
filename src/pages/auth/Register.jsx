// src/pages/auth/Register.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegister } from "@/hooks/auth/useRegister";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Destructure custom hook
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    department, setDepartment,
    role, setRole,
    loading, error,
    handleRegister,
  } = useRegister();

  // Double security: Prevent non-admins from even seeing the form
  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="fa-solid fa-lock text-5xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to add new users.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Add New User
        </h2>
        <p className="text-sm text-gray-500">
          Create a new account and assign roles/departments.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-soft border border-gray-100">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Budi Admin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin.budi@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm transition-all"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm cursor-pointer"
              >
                <option value="" disabled>-- Select Department --</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm cursor-pointer"
              >
                <option value="staff">Staff</option>
                <option value="verifier">Verifier</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                {/* Only Superadmin can create another admin or superadmin */}
                <option value="admin">Admin</option>
                {isSuperAdmin && <option value="superadmin">Superadmin</option>}
              </select>
            </div>
          </div>

          {/* Password Input */}
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm pr-11 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-mosque-primary focus:outline-none"
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3.5 rounded-lg border border-red-100">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className="px-6 py-2.5 rounded-lg font-bold text-white bg-mosque-dark hover:bg-mosque-primary transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i> Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}