import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import DynamicFormRenderer from "../../molecules/submission/DynamicFormRenderer";

export default function DocumentDetailModal(props) {
  const {
    isOpen,
    onClose,
    detailData,
    loading,
    cancelSubmission,
    resubmitSubmission,
    processApproval,
    fetchDetail,
  } = props; 
  
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [comments, setComments] = useState("");

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");

  // --- NEW STATE: FOR APPROVER SIGNATURE ---
  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    if (isOpen && detailData) {
      setIsEditing(false);
      setComments("");
      setSignatureFile(null); // Reset signature file
      setUploadFile(null);
      setUploadTitle("");
      setEditFormData(detailData.formData || {});
    }
  }, [isOpen, detailData]);

  // --- HANDLE FILE SELECT FOR ATTACHMENTS ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum file size is 5MB!");
      return;
    }
    setUploadFile(file);
    setUploadTitle(''); 
  };

  // --- EXECUTE ATTACHMENT UPLOAD ---
  const executeUpload = async () => {
    if (!uploadTitle.trim()) {
      toast.error("Attachment title is required! (e.g., Purchase Receipt)");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);

    const toastId = toast.loading('Uploading file...');
    try {
      const result = await api(`/api/attachments/${detailData.id}`, {
        method: 'POST',
        body: formData
      });
      
      if (result.success) {
        toast.success('File attached successfully!', { id: toastId });
        setUploadFile(null);
        setUploadTitle('');
        if (fetchDetail) fetchDetail(detailData.id); // Auto-refresh modal data
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  // --- HANDLE DELETE ATTACHMENT ---
  const handleDeleteAttachment = async (attachmentId) => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">Delete this attachment?</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancel</button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                const tid = toast.loading('Deleting...');
                try {
                  const result = await api(`/api/attachments/${attachmentId}`, { method: 'DELETE' });
                  if (result.success) {
                    toast.success('Attachment deleted!', { id: tid });
                    if (fetchDetail) fetchDetail(detailData.id);
                  }
                } catch (err) {
                  toast.error(`Failed: ${err.message}`, { id: tid });
                }
              }} 
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleDynamicFieldChange = (key, value, type) =>
    setEditFormData((prev) => ({
      ...prev,
      [key]: type === "number" ? Number(value) : value,
    }));

  const handleSaveRevision = () =>
    resubmitSubmission(detailData.id, editFormData);

  // --- NEW FEATURE: DOWNLOAD PDF FUNCTION ---
  const handleDownloadPdf = async () => {
    const tid = toast.loading("Preparing PDF document...");
    try {
      const blob = await api(`/api/exports/pdf/${detailData.id}`, {
        method: "GET",
      });

      // Create a temporary URL from the Blob, then trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // File name format: DOC_FRM-CUTI_2026_001.pdf
      a.download = `${detailData.docNumber.replace(/\//g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF downloaded successfully!", { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  // --- NEW FUNCTION: APPROVAL CONFIRMATION UI ---
  const confirmApprovalAction = (
    approvalId,
    action,
    comments,
    signatureFile,
  ) => {
    // Initial validation in UI to avoid popup if comments are empty when required
    if (
      (action === "reject" || action === "return") &&
      (!comments || !comments.trim())
    ) {
      toast.error(
        "Notes/Comments are required when rejecting or returning a document!",
      );
      return;
    }

    const actionText =
      action === "approve"
        ? "approve"
        : action === "reject"
          ? "reject"
          : "return";

    toast(
      (t) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">
            Are you sure you want to <b>{actionText}</b> this document?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                // Call the pure logic from props/hook here
                if (processApproval) {
                  await processApproval(
                    approvalId,
                    action,
                    comments,
                    signatureFile,
                  );
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-mosque-primary rounded hover:bg-mosque-dark shadow-sm transition"
            >
              Yes, Process
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  if (!isOpen) return null;

  const activeApproval = detailData?.approvals?.find(
    (a) => a.status === "submitted",
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-primary">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-mosque-dark">
              {isEditing ? "Document Revision" : t("submission.detail_title")}
            </h3>
            {!loading && detailData && (
              <p className="text-xs text-gray-500 font-mono mt-1">
                {detailData.docNumber}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* DOWNLOAD PDF BUTTON (Only appears if Approved) */}
            {!loading && detailData && detailData.status === "approved" && (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-sm animate-fade-in"
              >
                <i className="fa-solid fa-file-pdf"></i> Download PDF
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
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
                  <h4 className="text-lg font-bold text-gray-800">
                    {detailData.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">
                      {t("submission.submitter")}:
                    </span>{" "}
                    {detailData.submitter.name} (
                    {detailData.submitter.department || "-"})
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

              {/* Form Data Section */}
              <div>
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h5 className="text-sm font-bold text-gray-700">
                    <i className="fa-solid fa-file-lines text-mosque-primary mr-2"></i>{" "}
                    {t("submission.form_data")}
                  </h5>
                  {detailData.status === 'returned' && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-mosque-primary hover:underline"
                    >
                      <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                      Revision
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <DynamicFormRenderer
                      fields={detailData.formTemplate.schemaDefinition.fields}
                      formData={editFormData}
                      onChange={handleDynamicFieldChange}
                    />
                  </div>
                ) : (
                  /* Plain Text Form Area (View Mode) */
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailData.formTemplate.schemaDefinition.fields.map(
                      (field) => (
                        <div key={field.key} className="col-span-1">
                          <p className="text-xs text-gray-500 font-semibold uppercase">
                            {field.label}
                          </p>
                          <p className="text-sm text-gray-800 font-medium mt-1">
                            
                            {/* --- NEW NUMBER FORMATTING LOGIC --- */}
                            {field.type === 'number' ? (
                              field.format === 'currency' 
                                ? new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(detailData.formData[field.key] || 0)
                                : new Intl.NumberFormat('en-SG').format(detailData.formData[field.key] || 0) // Regular number with thousand separator
                            ) : (
                              detailData.formData[field.key] || '-'
                            )}

                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* --- FILE ATTACHMENTS AREA --- */}
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2 flex justify-between items-center">
                  <span><i className="fa-solid fa-paperclip text-mosque-primary mr-2"></i> File Attachments</span>
                  
                  {/* Select File Button (Only appears if no file is selected & status is valid) */}
                  {!uploadFile && detailData.status !== 'approved' && detailData.status !== 'rejected' && !isEditing && !processApproval && (
                    <label className="cursor-pointer bg-mosque-light hover:bg-mosque-primary hover:text-white text-mosque-dark px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5">
                      <i className="fa-solid fa-plus"></i> Add File
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                    </label>
                  )}
                </h5>
                
                {/* --- INLINE UPLOAD FORM (Appears after file is selected) --- */}
                {uploadFile && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4 animate-fade-in shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b border-blue-200/50 pb-2">
                      <span className="text-xs font-semibold text-blue-800 flex items-center gap-2">
                        <i className={`fa-solid ${uploadFile.name.endsWith('.pdf') ? 'fa-file-pdf text-red-500' : 'fa-image text-blue-500'} text-lg`}></i> 
                        {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button onClick={() => setUploadFile(null)} className="text-gray-400 hover:text-red-500 text-xs font-bold transition">
                        <i className="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter title (e.g., Purchase Receipt)" 
                        value={uploadTitle} 
                        onChange={(e) => setUploadTitle(e.target.value)} 
                        className="flex-1 text-sm p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                      <button onClick={executeUpload} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition whitespace-nowrap">
                        <i className="fa-solid fa-cloud-arrow-up mr-1.5"></i> Upload
                      </button>
                    </div>
                  </div>
                )}

                {/* --- ATTACHMENTS LIST --- */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
                  {detailData.attachments && detailData.attachments.length > 0 ? (
                    detailData.attachments.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition group">
                        
                        {/* Left Area: Icon & Detail Info (Click to open file) */}
                        <a 
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${file.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center gap-3 truncate"
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                            <i className={`text-xl fa-solid ${file.fileName.endsWith('.pdf') ? 'fa-file-pdf text-red-500' : 'fa-image text-blue-500'}`}></i>
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-mosque-primary transition truncate">{file.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{file.fileName} • {new Date(file.uploadedAt).toLocaleString()}</p>
                          </div>
                        </a>

                        {/* Right Area: Delete Button */}
                        {/* Only visible if document is not processed & not in Approver mode */}
                        {!processApproval && !isEditing && (detailData.status === 'submitted' || detailData.status === 'returned') && (
                          <button 
                            onClick={() => handleDeleteAttachment(file.id)} 
                            className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition shrink-0"
                            title="Delete Attachment"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                        
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic text-center py-4 flex flex-col items-center gap-2">
                      <i className="fa-solid fa-folder-open text-2xl text-gray-300"></i>
                      No files attached yet.
                    </p>
                  )}
                </div>
              </div>

              {/* --- APPROVER DECISION BOX (WITH SIGNATURE INPUT) --- */}
              {processApproval && activeApproval && (
                <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <h5 className="text-sm font-bold text-blue-900 mb-3">
                    <i className="fa-solid fa-clipboard-check mr-2"></i>
                    {t("submission.approval_action")}
                  </h5>

                  {/* Comment Input */}
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t("submission.comments_placeholder")}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-4"
                    rows="2"
                  />

                  {/* Signature Upload Input */}
                  <div className="mb-4 bg-white p-3 border border-blue-100 rounded-lg">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      <i className="fa-solid fa-signature text-mosque-primary mr-1"></i>
                      Upload Signature{" "}
                      <span className="text-gray-400 font-normal">
                        (Optional if already in profile)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setSignatureFile(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "reject",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition"
                    >
                      <i className="fa-solid fa-xmark mr-1.5"></i>{" "}
                      {t("submission.reject")}
                    </button>
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "return",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg text-sm font-bold transition"
                    >
                      <i className="fa-solid fa-rotate-left mr-1.5"></i>{" "}
                      {t("submission.return")}
                    </button>
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "approve",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition shadow-md"
                    >
                      <i className="fa-solid fa-check mr-1.5"></i>{" "}
                      {t("submission.approve")}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">
                  <i className="fa-solid fa-clock-rotate-left text-mosque-primary mr-2"></i>{" "}
                  {t("submission.audit_trail")}
                </h5>
                <div className="space-y-6 ml-2 border-l-2 border-gray-200 pl-4 relative">
                  {detailData.auditLogs.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-mosque-primary border-2 border-white shadow"></div>
                      <p className="text-xs font-bold text-gray-800">
                        {log.action}{" "}
                        <span className="font-normal text-gray-500 ml-2">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {log.notes}
                      </p>
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
              !loading && detailData?.status === "submitted" && cancelSubmission && (
                <button onClick={() => cancelSubmission(detailData.id)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
                  <i className="fa-solid fa-ban"></i> Cancel Submission
                </button>
              )
            )}
          </div>
          {!isEditing && <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Close</button>}
        </div>
      </div>
    </div>
  );
}