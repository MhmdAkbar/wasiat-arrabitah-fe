// src/hooks/workflow/useWorkflowForm.js
import { useState, useEffect } from 'react';

export const useWorkflowForm = (isOpen, template, getWorkflow, setupWorkflow, onClose) => {
  const [approverRoles, setApproverRoles] = useState([]);
  const [formError, setFormError] = useState('');

  // 1. Fetch data saat modal dibuka
  useEffect(() => {
    if (isOpen && template) {
      const fetchRoles = async () => {
        const existingRoles = await getWorkflow(template.id);
        
        // Ubah array string dari backend menjadi array object ber-UUID untuk UI
        // cth: ['verifier'] -> [{ id: '123-uuid', role: 'verifier' }]
        const formattedRoles = existingRoles.length > 0 
          ? existingRoles.map(role => ({ id: crypto.randomUUID(), role }))
          : [{ id: crypto.randomUUID(), role: 'verifier' }]; // Default

        setApproverRoles(formattedRoles);
      };
      fetchRoles();
    }
  }, [isOpen, template, getWorkflow]);

  // 2. Logika modifikasi array
  const handleAddStep = () => {
    setApproverRoles([...approverRoles, { id: crypto.randomUUID(), role: 'manager' }]);
  };

  const handleRemoveStep = (id) => {
    setApproverRoles(approverRoles.filter(item => item.id !== id));
  };

  const handleRoleChange = (id, newRole) => {
    setApproverRoles(approverRoles.map(item => 
      item.id === id ? { ...item, role: newRole } : item
    ));
  };

  // 3. Logika Submit
  const handleWorkflowSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (approverRoles.length === 0) {
      setFormError('Pilih minimal 1 pihak yang menyetujui (Approver)!');
      return;
    }

    // Ubah kembali array object (UI) menjadi array string sederhana untuk Backend payload
    // cth: [{ id: '123-uuid', role: 'verifier' }] -> ['verifier']
    const payloadRoles = approverRoles.map(item => item.role);

    const success = await setupWorkflow(template.id, payloadRoles);
    if (success) {
      if (onClose) onClose();
    }
  };

  return {
    approverRoles,
    formError,
    handleAddStep,
    handleRemoveStep,
    handleRoleChange,
    handleWorkflowSubmit
  };
};