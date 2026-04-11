//src/components/molecules/submission/DocumentModalHeader.jsx

import { useTranslation } from "react-i18next";

export default function DocumentModalHeader({ isEditing, detailData, loading, handleDownloadPdf, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
      <div>
        <h3 className="text-lg font-bold text-mosque-dark">{isEditing ? "Document Revision" : t("submission.detail_title")}</h3>
        {!loading && detailData && <p className="text-xs text-gray-500 font-mono mt-1">{detailData.docNumber}</p>}
      </div>
      <div className="flex items-center gap-4">
        {!loading && detailData && detailData.status === "approved" && (
          <button onClick={handleDownloadPdf} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <i className="fa-solid fa-file-pdf"></i> Download PDF
          </button>
        )}
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
}