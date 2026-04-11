import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";

export const useDocumentDetailModal = ({ isOpen, detailData, fetchDetail, resubmitSubmission, processApproval }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [comments, setComments] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    if (isOpen && detailData) {
      setIsEditing(false);
      setComments("");
      setSignatureFile(null);
      setUploadFile(null);
      setUploadTitle("");
      setEditFormData(detailData.formData || {});
    }
  }, [isOpen, detailData]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Maximum file size is 5MB!");
    setUploadFile(file);
    setUploadTitle("");
  };

  // Pure Logic Upload
  const executeUpload = async () => {
    if (!uploadTitle.trim()) return toast.error("Attachment title is required!");
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    
    const toastId = toast.loading("Uploading file...");
    try {
      const result = await api(`/api/attachments/${detailData.id}`, { method: "POST", body: formData });
      if (result.success) {
        toast.success("File attached successfully!", { id: toastId });
        setUploadFile(null);
        setUploadTitle("");
        if (fetchDetail) fetchDetail(detailData.id);
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  // Pure Logic Eksekusi Delete (Tanpa Konfirmasi UI)
  const executeDeleteAttachment = async (attachmentId, toastId) => {
    try {
      const result = await api(`/api/attachments/${attachmentId}`, { method: "DELETE" });
      if (result.success) {
        toast.success("Attachment deleted!", { id: toastId });
        if (fetchDetail) fetchDetail(detailData.id);
      }
    } catch (err) {
      toast.error(`Failed: ${err.message}`, { id: toastId });
    }
  };

  const handleDynamicFieldChange = (key, value, type) => setEditFormData((prev) => ({ ...prev, [key]: type === "number" ? Number(value) : value }));
  const handleSaveRevision = () => resubmitSubmission(detailData.id, editFormData);

  const handleDownloadPdf = async () => {
    const tid = toast.loading("Preparing PDF document...");
    try {
      const blob = await api(`/api/exports/pdf/${detailData.id}`, { method: "GET" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
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

 // Pure Logic Eksekusi Approve
  const executeApprovalAction = async (approvalId, action, finalSignatureOverride = null) => {
    if (processApproval) {
      // Gunakan finalSignatureOverride jika ada (dari Canvas), jika tidak gunakan state signatureFile
      const fileToSubmit = finalSignatureOverride || signatureFile;
      await processApproval(approvalId, action, comments, fileToSubmit);
    }
  };

  return {
    isEditing, setIsEditing,
    editFormData, handleDynamicFieldChange, handleSaveRevision,
    comments, setComments,
    uploadFile, setUploadFile,
    uploadTitle, setUploadTitle,
    handleFileSelect, executeUpload, 
    executeDeleteAttachment, // Diekspor sebagai eksekutor murni
    signatureFile, setSignatureFile,
    handleDownloadPdf, 
    executeApprovalAction // Diekspor sebagai eksekutor murni
  };
};