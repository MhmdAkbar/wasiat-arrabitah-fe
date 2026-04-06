import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useDocumentSubmission = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // State Form Payload
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState({}); // Akan berisi: { keperluan: "...", nominal: 150000 }
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambil template aktif saat halaman dimuat
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Hanya ambil template yang aktif
        setTemplates(result.data.filter(t => t.isActive));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Saat user memilih template dari dropdown
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    // Reset isi form
    setTitle('');
    const initialFormData = {};
    if (template && template.schemaDefinition && template.schemaDefinition.fields) {
      template.schemaDefinition.fields.forEach(field => {
        initialFormData[field.key] = ''; // Inisialisasi state kosong berdasarkan key
      });
    }
    setFormData(initialFormData);
    setError('');
  };

  // Saat user mengetik di input dinamis
  const handleDynamicFieldChange = (key, value, type) => {
    setFormData(prev => ({
      ...prev,
      // Pastikan tipe data number di-parsing agar backend tidak menolaknya
      [key]: type === 'number' ? Number(value) : value 
    }));
  };

  // Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setSubmitLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        formTemplateId: selectedTemplate.id,
        title,
        formData
      };

      // Asumsi backend route Anda berada di /api/submissions
      const response = await fetch('http://localhost:3000/api/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`${t('submission.success')} ${result.data.docNumber}`);
        // Reset Form setelah sukses
        setSelectedTemplate(null);
        setTitle('');
        setFormData({});
      } else {
        throw new Error(result.message || 'Gagal mengirim dokumen');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    templates,
    selectedTemplate,
    title, setTitle,
    formData,
    loading, submitLoading, error,
    handleTemplateChange,
    handleDynamicFieldChange,
    handleSubmit
  };
};