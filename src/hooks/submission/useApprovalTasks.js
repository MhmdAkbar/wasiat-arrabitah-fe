import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const useApprovalTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch tasks based on user role
      const result = await api('/api/submissions/tasks', { method: 'GET' });
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
      const result = await api(`/api/submissions/${id}`, { method: 'GET' });
      if (result.success) setDetailData(result.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- NEW FEATURE: APPROVAL PROCESS ---
  const processApproval = async (approvalId, action, comments) => {
    if ((action === 'reject' || action === 'return') && !comments.trim()) {
      toast.error('Notes/Comments are required when rejecting or returning a document!');
      return;
    }

    const actionText = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'return';
    if (!window.confirm(`Are you sure you want to ${actionText} this document?`)) return;

    try {
      const result = await api(`/api/approvals/${approvalId}`, {
        method: 'POST',
        body: JSON.stringify({ action, comments })
      });

      if (result.success) {
        toast.success('Action processed successfully!');
        setDetailData(null); // Close modal
        fetchTasks(); // Refresh task list
      }
    } catch (err) {
      toast.error(`Failed to process: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    detailData,
    detailLoading,
    fetchDetail,
    clearDetail: () => setDetailData(null),
    processApproval
  };
};