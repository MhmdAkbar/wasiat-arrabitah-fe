import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DynamicFormRenderer from "../../molecules/submission/DynamicFormRenderer";

export default function DocumentDetailModal({
  isOpen,
  onClose,
  detailData,
  loading,
  cancelSubmission,
  resubmitSubmission,
  processApproval,
}) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (isOpen && detailData) {
      setIsEditing(false);
      setComments("");
      setEditFormData(detailData.formData || {});
    }
  }, [isOpen, detailData]);

  if (!isOpen) return null;

  const handleDynamicFieldChange = (key, value, type) => {
    setEditFormData((prev) => ({
      ...prev,
      // Ensure both 'number' and 'currency' are treated as Numbers in state
      [key]: (type === "number" || type === "currency") ? Number(value) : value,
    }));
  };

  const handleSaveRevision = () => {
    resubmitSubmission(detailData.id, editFormData);
    setIsEditing(false);
  };

  const activeApproval = detailData?.approvals?.find((a) => a.status === "submitted");
  const isReturned = detailData?.status === "returned";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-primary">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-mosque-dark">{t("submission.detail_title")}</h3>
            {!loading && detailData && (
              <p className="text-xs text-gray-500 font-mono mt-1">{detailData.docNumber}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {loading || !detailData ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-mosque-primary mb-3"></i>
              <p className="text-gray-500 text-sm">Loading document details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Info Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{detailData.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">{t("submission.submitter")}:</span> {detailData.submitter.name} ({detailData.submitter.department || "-"})
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    detailData.status === "submitted" ? "bg-blue-100 text-blue-700" :
                    detailData.status === "returned" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {detailData.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">{new Date(detailData.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Form Data Section */}
              <div>
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h5 className="text-sm font-bold text-gray-700">
                    <i className="fa-solid fa-file-lines text-mosque-primary mr-2"></i> {t("submission.form_data")}
                  </h5>
                  {isReturned && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-mosque-primary hover:underline">
                      <i className="fa-solid fa-pen-to-square mr-1"></i> Edit Revision
                    </button>
                  )}
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  {isEditing ? (
                    <DynamicFormRenderer
                      fields={detailData.formTemplate.schemaDefinition.fields}
                      formData={editFormData}
                      onChange={handleDynamicFieldChange}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailData.formTemplate.schemaDefinition.fields.map((field) => (
                        <div key={field.key}>
                          <p className="text-xs text-gray-500 font-semibold uppercase">{field.label}</p>
                          <p className="text-sm text-gray-800 font-medium mt-1">
                            {field.type === "currency" ? (
                              new Intl.NumberFormat("en-SG", {
                                style: "currency",
                                currency: "SGD",
                              }).format(detailData.formData[field.key] || 0)
                            ) : field.type === "number" ? (
                              new Intl.NumberFormat("en-SG").format(detailData.formData[field.key] || 0)
                            ) : (
                              detailData.formData[field.key] || "-"
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Approver Action Panel */}
              {processApproval && activeApproval && (
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <h5 className="text-sm font-bold text-blue-900 mb-3">
                    <i className="fa-solid fa-clipboard-check mr-2"></i> {t("submission.approval_action")}
                  </h5>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t("submission.comments_placeholder")}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-4 bg-white"
                    rows="3"
                  />
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button onClick={() => processApproval(activeApproval.id, "reject", comments)} className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition">
                      {t("submission.reject")}
                    </button>
                    <button onClick={() => processApproval(activeApproval.id, "return", comments)} className="px-4 py-2 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg text-sm font-bold transition">
                      {t("submission.return")}
                    </button>
                    <button onClick={() => processApproval(activeApproval.id, "approve", comments)} className="px-4 py-2 bg-mosque-primary text-white hover:bg-mosque-dark rounded-lg text-sm font-bold transition shadow-md">
                      {t("submission.approve")}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">
                  <i className="fa-solid fa-clock-rotate-left text-mosque-primary mr-2"></i> {t("submission.audit_trail")}
                </h5>
                <div className="space-y-6 ml-2 border-l-2 border-gray-200 pl-4 relative">
                  {detailData.auditLogs.map((log) => (
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
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button onClick={handleSaveRevision} className="px-4 py-2 text-sm font-bold text-white bg-mosque-primary hover:bg-mosque-dark rounded-lg transition shadow-md">Save & Resubmit</button>
              </div>
            ) : (
              !loading && detailData && detailData.status === "submitted" && cancelSubmission && (
                <button onClick={() => cancelSubmission(detailData.id)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
                  <i className="fa-solid fa-ban"></i> Cancel Submission
                </button>
              )
            )}
          </div>
          {!isEditing && (
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}