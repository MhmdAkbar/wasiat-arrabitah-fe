import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

export default function DocumentApprovalBox({
  comments,
  setComments,
  signatureFile, // State file dari modal utama
  setSignatureFile,
  executeApprovalAction,
  activeApproval,
}) {
  const { t } = useTranslation();
  
  // State untuk Toggle Mode Input
  const [signatureMode, setSignatureMode] = useState("upload"); // 'upload' atau 'draw'
  const sigCanvasRef = useRef(null);

  // Fungsi Membersihkan Canvas
  const handleClear = () => {
    if (sigCanvasRef.current) sigCanvasRef.current.clear();
  };

  // Fungsi Undo (Menghapus coretan terakhir)
  const handleUndo = () => {
    if (sigCanvasRef.current) {
      const data = sigCanvasRef.current.toData();
      if (data && data.length > 0) {
        data.pop(); // Hapus stroke terakhir
        sigCanvasRef.current.fromData(data); // Gambar ulang
      }
    }
  };

  // Fungsi Rahasia: Mengubah Coretan Canvas menjadi File PNG
  const getSignatureFileToSubmit = () => {
    try {
      // Jika mode draw dan canvas tidak kosong
      if (signatureMode === "draw" && sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
        const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
        
        // Konversi Base64 Data URL menjadi Blob / File
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        // Jadikan objek File persis seperti kalau user upload gambar
        return new File([u8arr], "signature_drawn.png", { type: mime });
      }
    } catch (err) {
      console.error("Gagal mengonversi canvas:", err);
    }
    
    // Jika pakai mode upload atau canvas kosong/error, kembalikan state upload yang biasa
    return signatureFile; 
  };

  const confirmApproval = (approvalId, action) => {
    // Pastikan komentar aman dari undefined
    const amanComments = comments || "";

    if ((action === "reject" || action === "return") && amanComments.trim() === "") {
      return toast.error("Notes/Comments are required!");
    }

    // Ambil file final sebelum memunculkan popup konfirmasi
    const finalFile = getSignatureFileToSubmit();
    const actionText = action === "approve" ? "approve" : action === "reject" ? "reject" : "return";

    // UBAH `t` MENJADI `toastItem` AGAR TIDAK BENTROK DENGAN i18next
    toast(
      (toastItem) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">
            Are you sure you want to <b>{actionText}</b> this document?
          </p>
          <div className="flex gap-2 justify-end">
            <button 
              type="button" 
              onClick={() => toast.dismiss(toastItem.id)} 
              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastItem.id);
                // Lempar finalFile sebagai parameter ke-3 ke executeApprovalAction hook kita
                await executeApprovalAction(approvalId, action, finalFile);
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-mosque-primary hover:bg-mosque-dark shadow-sm transition rounded"
            >
              Yes, Process
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: "confirm-toast" }
    );
  };

  return (
    <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <h5 className="text-sm font-bold text-blue-900 mb-3">
        <i className="fa-solid fa-clipboard-check mr-2"></i> {t("submission.approval_action")}
      </h5>
      
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder={t("submission.comments_placeholder")}
        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-4"
        rows="2"
      />

      {/* --- BOX TANDA TANGAN --- */}
      <div className="mb-4 bg-white p-4 border border-blue-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <label className="block text-xs font-bold text-gray-700">
            <i className="fa-solid fa-signature text-mosque-primary mr-1"></i> Signature <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          
          {/* TOGGLE UPLOAD VS DRAW */}
          <div className="flex bg-gray-100 p-1 rounded-md w-max">
            <button
              type="button"
              onClick={() => setSignatureMode("upload")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${signatureMode === "upload" ? "bg-white text-mosque-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="fa-solid fa-image mr-1"></i> Upload
            </button>
            <button
              type="button"
              onClick={() => setSignatureMode("draw")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${signatureMode === "draw" ? "bg-white text-mosque-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <i className="fa-solid fa-pen-nib mr-1"></i> Draw
            </button>
          </div>
        </div>

        {/* AREA RENDER UPLOAD */}
        {signatureMode === "upload" && (
          <div className="animate-fade-in mt-2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setSignatureFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
            />
          </div>
        )}

        {/* AREA RENDER CANVAS (DRAW) */}
        {signatureMode === "draw" && (
          <div className="animate-fade-in mt-2">
            <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg overflow-hidden">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                  className: "w-full h-32 cursor-crosshair touch-none"
                }}
              />
            </div>
            {/* Tombol Undo & Clear */}
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={handleUndo} className="text-xs text-orange-600 font-semibold hover:text-orange-800 transition">
                <i className="fa-solid fa-rotate-left mr-1"></i> Undo
              </button>
              <button type="button" onClick={handleClear} className="text-xs text-red-600 font-semibold hover:text-red-800 transition">
                <i className="fa-solid fa-trash mr-1"></i> Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <button type="button" onClick={() => confirmApproval(activeApproval.id, "reject")} className="px-5 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition">
          <i className="fa-solid fa-xmark mr-1.5"></i> {t("submission.reject")}
        </button>
        <button type="button" onClick={() => confirmApproval(activeApproval.id, "return")} className="px-5 py-2.5 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg text-sm font-bold transition">
          <i className="fa-solid fa-rotate-left mr-1.5"></i> {t("submission.return")}
        </button>
        <button type="button" onClick={() => confirmApproval(activeApproval.id, "approve")} className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition shadow-md">
          <i className="fa-solid fa-check mr-1.5"></i> {t("submission.approve")}
        </button>
      </div>
    </div>
  );
}