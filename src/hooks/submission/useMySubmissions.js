// src/hooks/submission/useMySubmissions.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; 
import toast from 'react-hot-toast';

export const useMySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchMySubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api('/api/submissions/my', { method: 'GET' });
      if (result.success) setSubmissions(result.data);
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

  // --- NEW FEATURE: CANCEL SUBMISSION ---
  const cancelSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this submission?')) return;
    
    try {
      const result = await api(`/api/submissions/${id}`, { method: 'DELETE' });
      if (result.success) {
        toast.success('Submission cancelled successfully.');
        setDetailData(null); // Close modal
        fetchMySubmissions(); // Refresh table
      }
    } catch (err) {
      toast.error(`Failed to cancel: ${err.message}`);
    }
  };

  // --- NEW FEATURE: REVISE SUBMISSION ---
  const resubmitSubmission = async (id, updatedFormData) => {
    try {
      const result = await api(`/api/submissions/${id}/resubmit`, { 
        method: 'PUT',
        body: JSON.stringify({ formData: updatedFormData })
      });
      if (result.success) {
        toast.success('Document successfully revised and resubmitted.');
        setDetailData(null); // Close modal
        fetchMySubmissions(); // Refresh table
      }
    } catch (err) {
      toast.error(`Failed to revise: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  return {
    submissions,
    loading,
    error,
    detailData,
    detailLoading,
    fetchDetail,
    clearDetail: () => setDetailData(null),
    cancelSubmission, // Export new function
    resubmitSubmission // Export new function
  };
};