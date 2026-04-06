import { useState, useCallback } from 'react';

export const useWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get Workflow
  const getWorkflow = useCallback(async (formTemplateId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/workflows/${formTemplateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Kembalikan array of approverRoles ['verifier', 'manager'] agar mudah di-bind ke UI
        return result.data.map(item => item.approverRole);
      } else {
        // Jika 404/Kosong, kembalikan array kosong, bukan melempar error keras
        return []; 
      }
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/workflows/${formTemplateId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ approverRoles })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return true;
      } else {
        throw new Error(result.message || 'Gagal menyimpan workflow');
      }
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, getWorkflow, setupWorkflow };
};