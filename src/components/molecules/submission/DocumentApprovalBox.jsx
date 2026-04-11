// src/components/molecules/submission/DocumentApprovalBox.jsx
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function DocumentApprovalBox({ comments, setComments, setSignatureFile, executeApprovalAction, activeApproval }) {
  const { t } = useTranslation();

  // UI Confirmation JSX relocated here since toast requires React elements
  const confirmApproval = (approvalId, action) => {
    if ((action === "reject" || action === "return") && !comments.trim()) {
      return toast.error("Notes/Comments are required!");
    }
    
    const actionText = action === "approve" ? "approve" : action === "reject" ? "reject" : "return";
    
    toast((t) => (
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Are you sure you want to <b>{actionText}</b> this document?</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition rounded">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            await executeApprovalAction(approvalId, action);
          }} className="px-3 py-1.5 text-xs font-bold text-white bg-mosque-primary hover:bg-mosque-dark shadow-sm transition rounded">Yes, Process</button>
        </div>
      </div>
    ), { duration: Infinity });
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
      <div className="mb-4 bg-white p-3 border border-blue-100 rounded-lg">
        <label className="block text-xs font-bold text-gray-700 mb-1">
          <i className="fa-solid fa-signature text-mosque-primary mr-1"></i> Upload Signature <span className="text-gray-400 font-normal">(Optional if already in profile)</span>
        </label>
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png" 
          onChange={(e) => setSignatureFile(e.target.files[0])} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
        />
      </div>
      <div className="flex flex-wrap gap-3 justify-end">
        <button onClick={() => confirmApproval(activeApproval.id, "reject")} className="px-5 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition">
          <i className="fa-solid fa-xmark mr-1.5"></i> {t("submission.reject")}
        </button>
        <button onClick={() => confirmApproval(activeApproval.id, "return")} className="px-5 py-2.5 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg text-sm font-bold transition">
          <i className="fa-solid fa-rotate-left mr-1.5"></i> {t("submission.return")}
        </button>
        <button onClick={() => confirmApproval(activeApproval.id, "approve")} className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition shadow-md">
          <i className="fa-solid fa-check mr-1.5"></i> {t("submission.approve")}
        </button>
      </div>
    </div>
  );
}