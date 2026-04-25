// src/hooks/template/useCreateTemplateForm.js
import { useState } from 'react';

export const useCreateTemplateForm = (createTemplate, onClose) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  
  // Use UUID for React Key to prevent reconciliation issues when adding/removing.
  // Add 'format: decimal' as the default for new fields.
  const [fields, setFields] = useState([
    { id: crypto.randomUUID(), key: 'purpose', label: 'purpose title', type: 'text', format: 'decimal', required: true, isKeyEdited: false }
  ]);

  const resetForm = () => {
    setCode('');
    setName('');
    setFormError('');
    setFields([{ id: crypto.randomUUID(), key: 'purpose', label: 'purpose title', type: 'text', format: 'decimal', required: true, isKeyEdited: false }]);
  };

  const handleAddField = () => {
    setFields([...fields, { id: crypto.randomUUID(), key: '', label: '', type: 'text', format: 'decimal', required: true, isKeyEdited: false }]);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id, fieldName, value) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        const updatedField = { ...field, [fieldName]: value };
        
        if (fieldName === 'label' && !updatedField.isKeyEdited) {
          updatedField.key = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
        }
        if (fieldName === 'key') {
          updatedField.isKeyEdited = true;
        }
        return updatedField;
      }
      return field;
    }));
  };

  const validateForm = () => {
    setFormError('');
    
    if (fields.some(f => !f.label.trim() || !f.key.trim())) {
      setFormError('All Labels and Keys are required!');
      return false;
    }

    // Validate duplicate keys
    const keys = fields.map(f => f.key);
    const hasDuplicateKeys = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicateKeys) {
      setFormError('Duplicate Keys found! Keys must be unique.');
      return false;
    }

    return true;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      code, 
      name,
      schemaDefinition: { 
        version: "1.0", 
        // ENSURE FORMAT IS SENT TO BACKEND
        fields: fields.map(f => ({ 
          key: f.key, 
          label: f.label, 
          type: f.type, 
          format: f.type === 'number' ? f.format : undefined, // Only send format if the type is 'number'
          required: f.required 
        })) 
      }
    };

    const success = await createTemplate(payload);
    if (success) {
      resetForm();
      if (onClose) onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    if (onClose) onClose();
  };

  return {
    code, setCode,
    name, setName,
    fields, formError,
    handleAddField,
    handleRemoveField,
    handleFieldChange,
    handleCreateSubmit,
    handleClose
  };
};