import React from 'react';

export default function WorkflowStepItem({ 
  index, 
  item, 
  onChange, 
  onRemove, 
  isLast = false,  // Prop baru untuk UI konektor
  isOnly = false   // Prop baru untuk mencegah hapus jika sisa 1
}) {
  return (
    // 1. Container dirubah menjadi Card-like dengan efek hover
    <div className="group relative flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 mb-3">
      
      {/* 2. Drag Handle (Memberi kesan bahwa urutan ini bisa diubah/di-drag) */}
      <div 
        className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors pl-1" 
        title="Tahan untuk memindah urutan"
      >
        <i className="fa-solid fa-grip-vertical"></i>
      </div>

      {/* 3. Lingkaran Angka dengan Garis Konektor */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-mosque-light text-mosque-primary font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm z-10">
          {index + 1}
        </div>
        {/* Garis konektor visual ke item berikutnya (Kecuali item terakhir) */}
        {!isLast && (
          <div className="absolute top-8 w-[2px] h-full bg-gray-100 -z-0"></div>
        )}
      </div>

      {/* 4. Area Konten Utama */}
      <div className="flex-1 flex items-center gap-3">
        
        {/* Dropdown Role yang Dipercantik */}
        <div className="flex-1 relative">
          {/* Label untuk Screen Reader (A11y) */}
          <label htmlFor={`role-select-${item.id}`} className="sr-only">
            Pilih Peran untuk Langkah {index + 1}
          </label>
          
          <select 
            id={`role-select-${item.id}`}
            value={item.role || ""} 
            onChange={(e) => onChange(item.id, e.target.value)}
            // appearance-none menyembunyikan panah bawaan browser agar kita bisa pakai icon custom
            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-mosque-primary focus:border-mosque-primary outline-none text-sm cursor-pointer font-medium text-gray-700 transition-colors appearance-none"
          >
            <option value="" disabled>Pilih Peran...</option>
            <option value="verifier">Verifier</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="admin">Admin</option>
          </select>
          
          {/* Ikon Chevron Kustom untuk Dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <i className="fa-solid fa-chevron-down text-xs"></i>
          </div>
        </div>
        
        {/* 5. Tombol Hapus dengan Disabled State & Fokus Aksesibilitas */}
        <button 
          type="button" 
          onClick={() => onRemove(item.id)}
          disabled={isOnly} 
          className={`p-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-200 flex-shrink-0
            ${isOnly 
              ? 'text-gray-300 cursor-not-allowed bg-transparent' 
              : 'text-gray-400 hover:text-red-600 hover:bg-red-50 group-hover:text-red-400'
            }`}
          aria-label={`Hapus langkah ke-${index + 1}`}
          title={isOnly ? "Minimal harus ada 1 langkah" : "Hapus langkah ini"}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

    </div>
  );
}