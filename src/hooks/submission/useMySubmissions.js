import { useState, useEffect, useCallback } from 'react';

export const useMySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State untuk Detail Dokumen
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchMySubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/submissions/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmissions(result.data);
      } else {
        throw new Error(result.message);
      }
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/submissions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setDetailData(result.data);
      } else {
        throw new Error(result.message);
      }
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