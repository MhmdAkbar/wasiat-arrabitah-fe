import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Helper function agar kode lebih bersih
  const getLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium border-l-4 ${
      isActive
        ? "bg-mosque-primary/50 text-white border-mosque-gold shadow-sm" // Style saat Aktif
        : "text-gray-300 hover:bg-white/10 hover:text-white border-transparent" // Style saat Biasa
    }`;

  return (
    <aside className="w-full md:w-64 bg-mosque-dark text-white flex flex-col shadow-xl z-10 relative shrink-0">
      <div className="absolute right-0 top-0 w-1 h-full bg-mosque-gold"></div>

      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <i className="fa-solid fa-mosque text-mosque-gold text-2xl"></i>
        <div>
          <h2 className="text-lg font-bold tracking-wider leading-tight">
            BPM
          </h2>
          <p className="text-xs text-mosque-gold font-medium">Ar-Rabitah</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 flex flex-col gap-1 px-3">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu Utama
        </p>

        <NavLink to="/dashboard" className={getLinkStyle}>
          <i className="fa-solid fa-house w-5 text-center"></i>
          Dashboard
        </NavLink>

        <NavLink to="/templates" className={getLinkStyle}>
          <i className="fa-solid fa-file-invoice w-5 text-center"></i>
          Manajemen Template
        </NavLink>

        <NavLink to="/submissions/new" className={getLinkStyle}>
          <i className="fa-solid fa-folder-open w-5 text-center"></i>
          Pengajuan Dokumen
        </NavLink>

        <NavLink to="/submissions/my" className={getLinkStyle}>
          <i className="fa-solid fa-clock-rotate-left w-5 text-center"></i>
          Riwayat Pengajuan
        </NavLink>

        <NavLink
          to="/submissions/tasks"
          className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-lg transition text-gray-300 hover:text-white border-l-4 border-transparent"
        >
          <i className="fa-solid fa-inbox w-5 text-center"></i>
          Tugas Persetujuan
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
        &copy; 2026 DKM Ar-Rabitah
      </div>
    </aside>
  );
}
