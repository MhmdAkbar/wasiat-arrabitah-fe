import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '@/utils/api'; // <-- Import Pintu Gerbang Kita

export const useDocumentSubmission = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api('/api/templates', { method: 'GET' });
      if (result.success) {
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

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    setTitle('');
    const initialFormData = {};
    if (template && template.schemaDefinition && template.schemaDefinition.fields) {
      template.schemaDefinition.fields.forEach(field => {
        initialFormData[field.key] = ''; 
      });
    }
    setFormData(initialFormData);
    setError('');
  };

  const handleDynamicFieldChange = (key, value, type) => {
    setFormData(prev => ({
      ...prev,
      [key]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setSubmitLoading(true);
    setError('');

    try {
      const payload = { formTemplateId: selectedTemplate.id, title, formData };

      const result = await api('/api/submissions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (result.success) {
        alert(`${t('submission.success')} ${result.data.docNumber}`);
        setSelectedTemplate(null);
        setTitle('');
        setFormData({});
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