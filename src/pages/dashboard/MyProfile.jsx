import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import SignatureCanvas from "react-signature-canvas";

export default function MyProfile() {
  const [loading, setLoading] = useState(false);
  const sigCanvasRef = useRef(null);

  const handleClear = () => {
    if (sigCanvasRef.current) sigCanvasRef.current.clear();
  };

  const handleSaveSignature = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      return toast.error("Please draw your signature first!");
    }

    // GANTI bagian ini: Hapus .getTrimmedCanvas()
    const canvas = sigCanvasRef.current.getCanvas();
    const signatureBase64 = canvas.toDataURL("image/png");

    const tid = toast.loading("Saving signature...");
    setLoading(true);

    // ... sisa kode fetch API sama seperti sebelumnya

    try {
      // Pastikan endpoint ini sesuai dengan routing Express Anda (misal /api/users/me/signature)
      const result = await api("/api/users/me/signature", {
        method: "PUT",
        body: JSON.stringify({ signatureBase64 }),
      });

      if (result.success) {
        toast.success("Master signature saved successfully!", { id: tid });
        handleClear(); // Bersihkan setelah berhasil jika diinginkan
      }
    } catch (err) {
      toast.error(err.message, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">
        My Profile & Settings
      </h1>

      {/* Bagian Edit Data User (UI Placeholder - Perlu Backend Tambahan Jika Ingin Save Nama/Foto) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Your Email"
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <button className="px-5 py-2 bg-mosque-primary text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Master Signature */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Master Signature
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Set your main signature here. This signature will be automatically
          used when you approve documents unless you draw a new one on the spot.
        </p>

        <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg overflow-hidden mb-3">
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
            className="px-6 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}
