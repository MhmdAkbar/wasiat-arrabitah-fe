import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; // <-- Import Pintu Gerbang Kita

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
      alert(err.message);
    } finally {
      setDetailLoading(false);
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
    clearDetail: () => setDetailData(null)
  };
};