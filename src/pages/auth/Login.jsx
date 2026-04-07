import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/atoms/LangToggle";
import { useLogin } from "@/hooks/auth/useLogin";

export default function Login() {
  const { t } = useTranslation();
  
  // State untuk kontrol visibility password
  const [showPassword, setShowPassword] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-pattern relative z-0">
      <div className="absolute top-4 right-4 z-20">
        <LangToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-1/3 bg-linear-to-b from-mosque-dark to-transparent -z-10 opacity-90"></div>

      <div className="bg-white p-10 rounded-2xl shadow-soft w-full max-w-md border-t-4 border-mosque-gold relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mosque-light text-mosque-primary mb-4">
            <i className="fa-solid fa-mosque text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-mosque-dark tracking-wide">
            {t("app_name")}
          </h1>
          <p className="text-sm text-mosque-gold font-medium mt-1 uppercase tracking-widest">
            {t("mosque_name")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-mosque-primary bg-gray-50 focus:bg-white text-sm pr-11"
              />
              
              {/* Container Button dibuat dengan ukuran tetap agar ikon di dalamnya presisi */}
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
            {loading ? t("auth.loading") : t("auth.login_btn")}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500">
            {t("auth.no_account")}{" "}
            <Link
              to="/register"
              className="text-mosque-gold font-semibold hover:underline"
            >
              {t("auth.register_btn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}