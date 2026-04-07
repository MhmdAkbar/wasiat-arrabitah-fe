import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/atoms/LangToggle";

// Terima prop toggleSidebar
export default function Navbar({ toggleSidebar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail") || "ridzwan@arrabitah.com";
  const name = localStorage.getItem("userName") || "Administrator";
  const role = localStorage.getItem("userRole") || "staff";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center z-10 shrink-0 relative">
      
      {/* Sisi Kiri: Tombol Hamburger & Judul */}
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger dengan efek active/klik smooth */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-gray-600 hover:text-mosque-primary focus:outline-none transition-transform duration-200 active:scale-90"
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
        
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-tight">
            {t("dashboard.welcome_title")}
          </h3>
          <p className="text-xs text-gray-500 hidden sm:block">{t("dashboard.welcome_desc")}</p>
        </div>
      </div>

      {/* Sisi Kanan: Profil & Logout */}
      <div className="flex items-center gap-4 md:gap-6">
        <LangToggle />
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-mosque-light flex items-center justify-center text-mosque-primary font-bold uppercase shrink-0">
            {name.charAt(0)}
          </div>
          <div className="text-sm text-right hidden lg:block">
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
            className="ml-1 md:ml-2 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="hidden sm:inline">{t("dashboard.logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}