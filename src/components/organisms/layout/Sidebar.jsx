import { NavLink } from "react-router-dom";

// Terima state isOpen dan fungsi closeSidebar
export default function Sidebar({ isOpen, closeSidebar }) {
  
  const getLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium border-l-4 ${
      isActive
        ? "bg-mosque-primary/50 text-white border-mosque-gold shadow-sm"
        : "text-gray-300 hover:bg-white/10 hover:text-white border-transparent"
    }`;

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-mosque-dark text-white flex flex-col shadow-xl shrink-0
        transform transition-transform duration-300 ease-in-out will-change-transform
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="absolute right-0 top-0 w-1 h-full bg-mosque-gold"></div>

      {/* Header Sidebar & Tombol Close (Mobile) */}
      <div className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-mosque text-mosque-gold text-2xl"></i>
          <div>
            <h2 className="text-lg font-bold tracking-wider leading-tight">BPM</h2>
            <p className="text-xs text-mosque-gold font-medium">Ar-Rabitah</p>
          </div>
        </div>
        
        {/* Tombol X dengan efek rotasi smooth */}
        <button 
          onClick={closeSidebar}
          className="md:hidden text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 active:scale-90"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      {/* Menu Navigasi */}
      <nav className="mt-6 flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Main Menu
        </p>

        <NavLink to="/dashboard" onClick={closeSidebar} className={getLinkStyle}>
          <i className="fa-solid fa-house w-5 text-center"></i>
          Dashboard
        </NavLink>

        <NavLink to="/templates" onClick={closeSidebar} className={getLinkStyle}>
          <i className="fa-solid fa-file-invoice w-5 text-center"></i>
          Template Management
        </NavLink>

        <NavLink to="/submissions/new" onClick={closeSidebar} className={getLinkStyle}>
          <i className="fa-solid fa-folder-open w-5 text-center"></i>
          Document Submission
        </NavLink>

        <NavLink to="/submissions/my" onClick={closeSidebar} className={getLinkStyle}>
          <i className="fa-solid fa-clock-rotate-left w-5 text-center"></i>
          Submission History
        </NavLink>

        <NavLink to="/submissions/tasks" onClick={closeSidebar} className={getLinkStyle}>
          <i className="fa-solid fa-inbox w-5 text-center"></i>
          Approval Tasks
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
        &copy; 2026 DKM Ar-Rabitah
      </div>
    </aside>
  );
}