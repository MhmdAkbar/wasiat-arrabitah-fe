// src/hooks/submission/useApprovalTasks.js
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

export const useApprovalTasks = () => {
  // Fix: Added variable names to useState
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api("/api/submissions/tasks", { method: "GET" });
      if (result.success) setTasks(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = async (id) => {
    setDetailLoading(true);
    setDetailData(null);
    try {
      const result = await api(`/api/submissions/${id}`, { method: "GET" });
      if (result.success) setDetailData(result.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- FITUR BARU: PROSES APPROVAL DENGAN JSON BASE64 ---
  const processApproval = async (
    approvalId,
    action,
    comments,
    signatureBase64,
  ) => {
    const tid = toast.loading("Processing...");
    try {
      // PERBAIKAN: Payload lengkap. signatureBase64 akan dikirim sebagai 'null' jika kosong.
      const payload = {
        action,
        comments,
        signatureBase64: signatureBase64 || null,
      };

      const result = await api(`/api/approvals/${approvalId}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast.success("Processed successfully!", { id: tid });
        setDetailData(null);
        fetchTasks();
        return true;
      }
    } catch (err) {
      // Jika Backend melempar error "Signature is required...", akan ditangkap dan ditampilkan di sini
      toast.error(err.message || "Failed to process!", {
        id: tid,
        duration: 5000,
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Added dependency

  return {
    tasks,
    loading,
    error,
    detailData,
    detailLoading,
    fetchDetail,
    clearDetail: () => setDetailData(null),
    processApproval,
  };
};
