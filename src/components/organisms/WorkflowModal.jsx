import { useTranslation } from 'react-i18next';
import { useWorkflowForm } from '../../hooks/useWorkflowForm';
import WorkflowStepBuilder from '../molecules/WorkflowStepBuilder';

export default function WorkflowModal({ isOpen, onClose, template, getWorkflow, setupWorkflow, loadingWorkflow }) {
  const { t } = useTranslation();
  
  // Panggil semua logika dan state dari Custom Hook
  const {
    approverRoles,
    formError,
    handleAddStep,
    handleRemoveStep,
    handleRoleChange,
    handleWorkflowSubmit
  } = useWorkflowForm(isOpen, template, getWorkflow, setupWorkflow, onClose);

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-mosque-gold overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-mosque-dark flex items-center gap-2">
              <i className="fa-solid fa-sitemap"></i> {t('template.workflow_title')}
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{template.code} - {template.name}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleWorkflowSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6">{t('template.workflow_desc')}</p>

          {/* Error Handling UI */}
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> {formError}
            </div>
          )}

          {/* State Loading (saat fetching data awal) */}
          {loadingWorkflow ? (
            <div className="text-center py-4">
              <i className="fa-solid fa-spinner fa-spin text-mosque-primary text-2xl"></i>
            </div>
          ) : (
            /* Workflow Builder Builder Component */
            <WorkflowStepBuilder 
              approverRoles={approverRoles}
              onAdd={handleAddStep}
              onRemove={handleRemoveStep}
              onChange={handleRoleChange}
            />
          )}

          {/* Footer Modal */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              {t('template.cancel')}
            </button>
            <button type="submit" disabled={loadingWorkflow} className="px-5 py-2 text-sm font-bold text-white bg-mosque-dark hover:bg-mosque-primary rounded-lg transition flex items-center gap-2">
              <i className="fa-solid fa-check-double"></i> {t('template.save_workflow')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}