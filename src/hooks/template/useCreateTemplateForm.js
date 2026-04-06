import { useState } from 'react';

export const useCreateTemplateForm = (createTemplate, onClose) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  
  // Gunakan UUID untuk React Key agar reconciliation tidak kacau saat dihapus/ditambah
  const [fields, setFields] = useState([
    { id: crypto.randomUUID(), key: 'keperluan', label: 'Judul Keperluan', type: 'text', required: true, isKeyEdited: false }
  ]);

  const resetForm = () => {
    setCode('');
    setName('');
    setFormError('');
    setFields([{ id: crypto.randomUUID(), key: 'keperluan', label: 'Judul Keperluan', type: 'text', required: true, isKeyEdited: false }]);
  };

  const handleAddField = () => {
    setFields([...fields, { id: crypto.randomUUID(), key: '', label: '', type: 'text', required: true, isKeyEdited: false }]);
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
      setFormError('Semua Label dan Key wajib diisi!');
      return false;
    }

    // Validasi duplikasi key
    const keys = fields.map(f => f.key);
    const hasDuplicateKeys = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicateKeys) {
      setFormError('Terdapat Key yang duplikat! Key harus unik.');
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
        fields: fields.map(f => ({ key: f.key, label: f.label, type: f.type, required: f.required })) 
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