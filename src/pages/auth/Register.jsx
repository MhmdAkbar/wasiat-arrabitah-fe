import { useState } from "react"; // Tambahkan useState
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangToggle from "../../components/atoms/LangToggle";
import { useRegister } from "../../hooks/auth/useRegister";

export default function Register() {
  const { t } = useTranslation();

  // State untuk kontrol mata password
  const [showPassword, setShowPassword] = useState(false);

  // Destructuring semua state dan fungsi dari Custom Hook
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    department,
    setDepartment,
    role,
    setRole,
    loading,
    error,
    handleRegister,
  } = useRegister();

  return (
    <div className="flex items-center justify-center min-h-screen bg-pattern relative z-0 py-10">
      <div className="absolute top-4 right-4 z-20">
        <LangToggle />
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-soft w-full max-w-md border-t-4 border-mosque-gold relative">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-mosque-dark">
            {t("auth.register_title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("app_name")} - {t("mosque_name")}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.name")}
            </label>
            <input
              type="text"
              required
              placeholder="ex : John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              placeholder="ridzwan@arrabitah.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ----- DROPDOWN DEPARTEMEN ----- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.department")}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm cursor-pointer"
              >
                <option value="" disabled>
                  -- Pilih --
                </option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {/* ----- DROPDOWN ROLE ----- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.role") || "Role"}
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
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.password")}
            </label>
            {/* Wrapper relative untuk input dan tombol mata */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm pr-11"
              />
              
              {/* Tombol dengan animasi smooth */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-mosque-primary focus:outline-none transition-colors duration-200"
              >
                {/* Ikon Mata Terbuka */}
                <i 
                  className={`fa-solid fa-eye absolute transition-all duration-300 ease-in-out ${
                    showPassword ? "opacity-0 scale-50 rotate-[-10deg]" : "opacity-100 scale-100 rotate-0"
                  }`}
                ></i>
                
                {/* Ikon Mata Tertutup */}
                <i 
                  className={`fa-solid fa-eye-slash absolute transition-all duration-300 ease-in-out ${
                    showPassword ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-[10deg]"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 mt-2 rounded-lg font-semibold text-white bg-mosque-dark hover:bg-mosque-primary transition disabled:opacity-70"
          >
            {loading ? t("auth.loading") : t("auth.register_btn")}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500">
            {t("auth.have_account")}{" "}
            <Link
              to="/"
              className="text-mosque-gold font-semibold hover:underline"
            >
              {t("auth.login_btn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}