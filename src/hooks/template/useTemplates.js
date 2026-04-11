import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; 
import { toast } from 'react-hot-toast'; 

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api('/api/templates', { method: 'GET' });
      if (result.success) setTemplates(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (templateData) => {
    try {
      const result = await api('/api/templates', {
        method: 'POST',
        body: JSON.stringify({
          code: templateData.code,
          name: templateData.name,
          schemaDefinition: templateData.schemaDefinition
        })
      });

      if (result.success) {
        fetchTemplates(); 
        return true; 
      }
      return false;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  // --- BERSIH DARI JSX: HANYA LOGIKA EKSEKUSI API ---
  const executeDeleteTemplate = async (id) => {
    const tid = toast.loading('Memproses penghapusan...');
    try {
      const result = await api(`/api/templates/${id}`, { method: 'DELETE' });
      if (result.success) {
        toast.success(result.message, { id: tid, duration: 4000 });
        fetchTemplates(); // Refresh data
        return true;
      }
    } catch (err) {
      toast.error(`failed to delete : ${err.message}`, { id: tid });
      return false;
    }
  };

  return { 
    templates, 
    loading, 
    error, 
    createTemplate, 
    executeDeleteTemplate, // <-- Ekspor fungsi ini
    refresh: fetchTemplates 
  };
};