import { useTranslation } from 'react-i18next';
import { useCreateTemplateForm } from '../../hooks/useCreateTemplateForm';
import TemplateBasicInfo from '../molecules/TemplateBasicInfo';
import FieldBuilder from './FieldBuilder';

export default function CreateTemplateModal({ isOpen, onClose, createTemplate }) {
  const { t } = useTranslation();
  
  const {
    code, setCode,
    name, setName,
    fields, formError,
    handleAddField,
    handleRemoveField,
    handleFieldChange,
    handleCreateSubmit,
    handleClose
  } = useCreateTemplateForm(createTemplate, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-gold">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-mosque-dark">{t('template.add_btn')}</h3>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-red-500 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
            
            {/* Error Handling UI */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i> {formError}
              </div>
            )}

            {/* Basic Info Section */}
            <TemplateBasicInfo code={code} setCode={setCode} name={name} setName={setName} />

            {/* Dynamic Form Builder Section */}
            <FieldBuilder 
              fields={fields} 
              onAdd={handleAddField} 
              onRemove={handleRemoveField} 
              onChange={handleFieldChange} 
            />

          </div>
          
          {/* Footer Modal */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <button type="button" onClick={handleClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              {t('template.cancel')}
            </button>
            <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-mosque-dark hover:bg-mosque-primary rounded-lg transition flex items-center gap-2 shadow-md">
              <i className="fa-solid fa-save"></i>
              {t('template.save')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}