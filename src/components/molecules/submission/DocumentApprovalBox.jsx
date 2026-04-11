import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

export default function DocumentApprovalBox({
  comments,
  setComments,
  processApproval,
  activeApproval,
}) {
  const { t } = useTranslation();
  const sigCanvasRef = useRef(null);

  const handleClear = () => {
    if (sigCanvasRef.current) sigCanvasRef.current.clear();
  };

  const handleUndo = () => {
    if (sigCanvasRef.current) {
      const data = sigCanvasRef.current.toData();
      if (data && data.length > 0) {
        data.pop();
        sigCanvasRef.current.fromData(data);
      }
    }
  };

  const getSignatureBase64 = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const canvas = sigCanvasRef.current.getCanvas();
      return canvas.toDataURL("image/png");
    }
    return null; 
  };

  const confirmApproval = (approvalId, action) => {
    const amanComments = comments || "";

    // 1. PERBAIKAN: Komentar wajib untuk SEMUA aksi (Reject, Return, Approve)
    if (amanComments.trim() === "") {
      return toast.error("Notes/Comments are required for all actions!");
    }

    const actionText = action === "approve" ? "approve" : action === "reject" ? "reject" : "return";

    toast(
      (toastItem) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">
            Are you sure you want to <b>{actionText}</b> this document?
          </p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => toast.dismiss(toastItem.id)} className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition rounded">
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastItem.id);
                
                // 2. PERBAIKAN: Ambil Canvas TEPAT saat tombol 'Yes' ditekan
                const finalBase64 = getSignatureBase64();
                
                // Kamera Pengintai untuk FE (Bisa Anda lihat di Console F12)
                console.log("🕵️‍♂️ [FE DEBUG] TTD Canvas Terkirim:", finalBase64 ? "YA (Panjang: " + finalBase64.length + ")" : "KOSONG/NULL");

                // Lempar ke Hook
                await processApproval(approvalId, action, comments, finalBase64);
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

      <div className="mb-4 bg-white p-4 border border-blue-100 rounded-lg">
        <label className="block text-xs font-bold text-gray-700 mb-3">
          <i className="fa-solid fa-signature text-mosque-primary mr-1"></i> Draw Signature <br/>
          <span className="text-gray-400 font-normal">(Leave blank to use your saved profile signature)</span>
        </label>

        <div className="animate-fade-in mt-2">
          <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg overflow-hidden">
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{ className: "w-full h-32 cursor-crosshair touch-none" }}
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={handleUndo} className="text-xs text-orange-600 font-semibold hover:text-orange-800 transition">
              <i className="fa-solid fa-rotate-left mr-1"></i> Undo
            </button>
            <button type="button" onClick={handleClear} className="text-xs text-red-600 font-semibold hover:text-red-800 transition">
              <i className="fa-solid fa-trash mr-1"></i> Clear
            </button>
          </div>
        </div>
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