import { useState, useEffect, useCallback } from 'react';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTemplates(result.data);
      } else {
        throw new Error(result.message || 'Gagal memuat template');
      }
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
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/templates', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          code: templateData.code,
          name: templateData.name,
          schemaDefinition: templateData.schemaDefinition // Langsung kirim objeknya!
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchTemplates(); 
        return true; 
      } else {
        throw new Error(result.message || 'Gagal membuat template');
      }
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  return { templates, loading, error, createTemplate, refresh: fetchTemplates };
};