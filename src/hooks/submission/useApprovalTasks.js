import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';

export const useApprovalTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Mengambil data task sesuai role user
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
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- FITUR BARU: PROSES PERSETUJUAN ---
  const processApproval = async (approvalId, action, comments) => {
    if ((action === 'reject' || action === 'return') && !comments.trim()) {
      alert('Catatan/Komentar wajib diisi jika menolak atau mengembalikan dokumen!');
      return;
    }

    const actionText = action === 'approve' ? 'menyetujui' : action === 'reject' ? 'menolak' : 'mengembalikan';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionText} dokumen ini?`)) return;

    try {
      const result = await api(`/api/approvals/${approvalId}`, {
        method: 'POST',
        body: JSON.stringify({ action, comments })
      });

      if (result.success) {
        alert('Tindakan berhasil diproses!');
        setDetailData(null); // Tutup modal
        fetchTasks(); // Refresh daftar tugas
      }
    } catch (err) {
      alert(`Gagal memproses: ${err.message}`);
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