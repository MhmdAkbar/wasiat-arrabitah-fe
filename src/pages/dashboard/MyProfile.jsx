// src/pages/dashboard/MyProfile.jsx
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import SignatureCanvas from "react-signature-canvas";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function MyProfile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false); // Loading state khusus save profile
  const sigCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // State untuk menyimpan data dari backend
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    signatureUrl: null,
    avatarUrl: null, // Tambahkan avatarUrl
    avatarBase64: null, // Temporary state untuk preview gambar yang baru dipilih
  });

  const fetchMyProfile = async () => {
    try {
      const result = await api("/api/users/me", { method: "GET" });
      if (result.success) {
        setProfile({
          name: result.data.name || "",
          email: result.data.email || "",
          role: result.data.role || "",
          signatureUrl: result.data.signatureUrl || null,
          avatarUrl: result.data.avatarUrl || null,
          avatarBase64: null, // Reset preview
        });
      }
    } catch (err) {
      toast.error("Failed to load profile data: " + err.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleClear = () => {
    if (sigCanvasRef.current) sigCanvasRef.current.clear();
  };

  const handleSaveSignature = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      return toast.error("Please draw your signature first!");
    }

    const canvas = sigCanvasRef.current.getCanvas();
    const signatureBase64 = canvas.toDataURL("image/png");

    const tid = toast.loading("Saving signature...");
    setLoading(true);

    try {
      const result = await api("/api/users/me/signature", {
        method: "PUT",
        body: JSON.stringify({ signatureBase64 }),
      });

      if (result.success) {
        toast.success("Master signature saved successfully!", { id: tid });
        handleClear();
        await fetchMyProfile(); 
      }
    } catch (err) {
      toast.error(err.message, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  // ----- FUNGSI BARU UNTUK FOTO PROFIL -----

  // Meng-handle saat user memilih gambar dari file explorer
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Batasi ukuran file misal maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image is too large! Maximum 2MB.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Simpan string Base64 ke dalam state untuk di-preview dan di-submit nanti
      setProfile((prev) => ({ ...prev, avatarBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Memicu klik pada elemen input type="file" yang tersembunyi
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Eksekusi API Update Nama & Foto Profil
  const handleUpdateProfile = async () => {
    if (!profile.name.trim()) return toast.error("Name cannot be empty!");

    const tid = toast.loading("Updating profile...");
    setProfileLoading(true);

    try {
      const result = await api("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ 
          name: profile.name,
          avatarBase64: profile.avatarBase64 // Kirim ke Backend
        }),
      });

      if (result.success) {
        toast.success("Profile updated successfully!", { id: tid });
        // Update nama yang tersimpan di localStorage agar Dashboard langsung berubah
        localStorage.setItem("userName", result.data.name);
        await fetchMyProfile(); // Ambil data segar
      }
    } catch (err) {
      toast.error(err.message, { id: tid });
    } finally {
      setProfileLoading(false);
    }
  };

  // Helper untuk inisial (jika tidak ada foto profil)
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-mosque-primary"></i>
      </div>
    );
  }

  // Tentukan gambar yang akan ditampilkan: Preview (jika baru diubah) > Gambar DB > Inisial
  const displayAvatar = profile.avatarBase64 || (profile.avatarUrl ? `${BASE_URL}${profile.avatarUrl}` : null);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">
        My Profile & Settings
      </h1>

      {/* Bagian Edit Data User */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-700">Personal Information</h2>
          <span className="px-3 py-1 bg-mosque-light text-mosque-primary text-xs font-bold rounded-full uppercase tracking-wider">
            Role: {profile.role}
          </span>
        </div>

        {/* ----- AREA FOTO PROFIL (AVATAR) ----- */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <div className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-sm flex items-center justify-center overflow-hidden bg-mosque-light text-mosque-primary text-3xl font-bold">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(profile.name)
              )}
            </div>
            {/* Overlay Edit Icon saat di-hover */}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <i className="fa-solid fa-camera text-white text-xl"></i>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Profile Picture</h3>
            <p className="text-xs text-gray-500 mb-2">JPG or PNG, max size 2MB.</p>
            <button 
              onClick={triggerFileInput}
              className="text-xs font-bold text-mosque-primary hover:text-mosque-dark transition bg-mosque-primary/10 px-3 py-1.5 rounded-lg"
            >
              Change Picture
            </button>
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              className="hidden" 
            />
          </div>
        </div>
        {/* ----------------------------------- */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
            />
          </div>
          <div className="md:col-span-2 pt-2 border-t border-gray-50 mt-2">
            <button 
              onClick={handleUpdateProfile}
              disabled={profileLoading}
              className="px-6 py-2.5 bg-mosque-primary text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {profileLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Master Signature (Tidak Berubah) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Master Signature
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Set your main signature here. This signature will be automatically
          used when you approve documents.
        </p>

        {profile.signatureUrl && (
          <div className="mb-6 p-4 border border-green-100 bg-green-50 rounded-lg flex flex-col items-center">
            <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">
              <i className="fa-solid fa-check-circle mr-1"></i> Your Current Signature
            </p>
            <img 
              src={`${BASE_URL}${profile.signatureUrl}`} 
              alt="Current Signature" 
              className="h-24 object-contain mix-blend-multiply"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <label className="block text-xs font-bold text-gray-500 mb-2">
          {profile.signatureUrl ? "Draw a new signature to replace the current one:" : "Draw your signature below:"}
        </label>
        
        <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg overflow-hidden mb-4">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              className: "w-full h-48 cursor-crosshair touch-none",
            }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition"
          >
            Clear Canvas
          </button>
          <button
            type="button"
            onClick={handleSaveSignature}
            disabled={loading}
            className="px-6 py-2 bg-mosque-dark text-white font-bold rounded-lg hover:bg-mosque-primary transition shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>}
            {loading ? "Saving..." : "Save Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}