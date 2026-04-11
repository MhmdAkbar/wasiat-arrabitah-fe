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

  const processApproval = async (approvalId, action, comments, signatureFile) => {
    // Pure API logic
    const tid = toast.loading("Processing...");
    try {
      const formData = new FormData();
      formData.append("action", action);
      if (comments) formData.append("comments", comments);
      if (signatureFile) formData.append("signature", signatureFile);

      const result = await api(`/api/approvals/${approvalId}`, {
        method: "POST",
        body: formData,
      });

      if (result.success) {
        toast.success("Processed successfully!", { id: tid });
        setDetailData(null);
        fetchTasks();
        return true;
      }
    } catch (err) {
      toast.error(`Failed: ${err.message}`, { id: tid });
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