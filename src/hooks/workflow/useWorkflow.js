import { useState, useCallback } from 'react';
import { api } from '@/utils/api'; // <-- Import API Wrapper
import toast from 'react-hot-toast';

export const useWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get Workflow
  const getWorkflow = useCallback(async (formTemplateId) => {
    setLoading(true);
    setError('');
    try {
      const result = await api(`/api/workflows/${formTemplateId}`, { method: 'GET' });
      
      if (result.success) {
        // Kembalikan array of approverRoles ['verifier', 'manager'] agar mudah di-bind ke UI
        return result.data.map(item => item.approverRole);
      }
      return []; 
    } catch (err) {
      console.error("Error fetching workflow:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup/Update Workflow (POST)
  const setupWorkflow = async (formTemplateId, approverRoles) => {
    setLoading(true);
    setError('');
    try {
      const result = await api(`/api/workflows/${formTemplateId}`, {
        method: 'POST',
        body: JSON.stringify({ approverRoles })
      });

      if (result.success) {
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, getWorkflow, setupWorkflow };
};