import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/atoms/LangToggle";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mengambil data dinamis dari localStorage yang diset saat login
  const email = localStorage.getItem("userEmail") || "admin@arrabitah.id";
  const name = localStorage.getItem("userName") || "Administrator";
  const role = localStorage.getItem("userRole") || "staff";

  const handleLogout = () => {
    // Bersihkan semua data kredensial
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-0">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          {t("dashboard.welcome_title")}
        </h3>
        <p className="text-xs text-gray-500">{t("dashboard.welcome_desc")}</p>
      </div>
      <div className="flex items-center gap-6">
        <LangToggle />
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mosque-light flex items-center justify-center text-mosque-primary font-bold uppercase">
            {name.charAt(0)} {/* Menampilkan inisial nama */}
          </div>
          <div className="text-sm text-right hidden md:block">
            <div className="font-semibold text-gray-800">
              {name}{" "}
              <span className="text-[10px] bg-mosque-gold text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-1">
                {role}
              </span>
            </div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition font-medium flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="hidden lg:inline">{t("dashboard.logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
