// src/components/molecules/workflow/WorkflowStepBuilder.jsx
import { useTranslation } from 'react-i18next';
import WorkflowStepItem from './WorkflowStepItem';

export default function WorkflowStepBuilder({ approverRoles, onAdd, onRemove, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 relative">
      {/* Vertical connector line (UI Connector) */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

      {approverRoles.map((item, index) => (
        <WorkflowStepItem 
          key={item.id} 
          index={index}
          item={item}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}

      {approverRoles.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-2 italic">{t('template.no_workflow')}</div>
      )}

      <div className="pt-2">
        <button 
          type="button" 
          onClick={onAdd} 
          className="ml-12 text-xs font-bold text-mosque-primary hover:text-mosque-dark flex items-center gap-1.5 transition"
        >
          <i className="fa-solid fa-plus-circle"></i> {t('template.add_step')}
        </button>
      </div>
    </div>
  );
}