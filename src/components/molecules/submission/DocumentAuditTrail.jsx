// src/components/molecules/submission/DocumentAuditTrail.jsx
import { useTranslation } from "react-i18next";

export default function DocumentAuditTrail({ auditLogs }) {
  const { t } = useTranslation();

  return (
    <div>
      <h5 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">
        <i className="fa-solid fa-clock-rotate-left text-mosque-primary mr-2"></i> {t("submission.audit_trail")}
      </h5>
      <div className="space-y-6 ml-2 border-l-2 border-gray-200 pl-4 relative">
        {auditLogs.map((log) => (
          <div key={log.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-mosque-primary border-2 border-white shadow"></div>
            <p className="text-xs font-bold text-gray-800">
              {log.action} <span className="font-normal text-gray-500 ml-2">{new Date(log.createdAt).toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-600 mt-0.5">{log.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}