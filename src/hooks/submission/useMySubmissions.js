import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; 

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

  // --- FITUR BARU: BATALKAN PENGAJUAN ---
  const cancelSubmission = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pengajuan ini?')) return;
    
    try {
      const result = await api(`/api/submissions/${id}`, { method: 'DELETE' });
      if (result.success) {
        alert('Pengajuan berhasil dibatalkan.');
        setDetailData(null); // Tutup modal
        fetchMySubmissions(); // Refresh tabel
      }
    } catch (err) {
      alert(`Gagal membatalkan: ${err.message}`);
    }
  };

  // --- FITUR BARU: REVISI PENGAJUAN ---
  const resubmitSubmission = async (id, updatedFormData) => {
    try {
      const result = await api(`/api/submissions/${id}/resubmit`, { 
        method: 'PUT',
        body: JSON.stringify({ formData: updatedFormData })
      });
      if (result.success) {
        alert('Dokumen berhasil direvisi dan dikirim ulang.');
        setDetailData(null); // Tutup modal
        fetchMySubmissions(); // Refresh tabel
      }
    } catch (err) {
      alert(`Gagal merevisi: ${err.message}`);
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
    cancelSubmission, // Ekspor fungsi baru
    resubmitSubmission // Ekspor fungsi baru
  };
};