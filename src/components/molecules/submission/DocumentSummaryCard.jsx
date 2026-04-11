// src/components/molecules/submission/DocumentSummaryCard.jsx
import { useTranslation } from "react-i18next";

export default function DocumentSummaryCard({ detailData }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h4 className="text-lg font-bold text-gray-800">{detailData.title}</h4>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold text-gray-700">{t("submission.submitter")}:</span>{" "}
          {detailData.submitter.name} ({detailData.submitter.department || "-"})
        </p>
      </div>
      <div className="text-right">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            detailData.status === "submitted"
              ? "bg-blue-100 text-blue-700"
              : detailData.status === "returned"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {detailData.status}
        </span>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(detailData.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}