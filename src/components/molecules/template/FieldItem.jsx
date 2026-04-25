// src/components/molecules/template/FieldItem.jsx
import { useTranslation } from 'react-i18next';

export default function FieldItem({ field, onChange, onRemove, canRemove }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap md:flex-nowrap items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group transition hover:border-mosque-primary/50">
      
      {canRemove && (
        <button type="button" onClick={() => onRemove(field.id)} 
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-500 hover:text-white"
          title={t('template.remove')}>
          <i className="fa-solid fa-times text-xs"></i>
        </button>
      )}

      <div className="w-full md:w-1/3">
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('template.field_label')}</label>
        <input type="text" required placeholder="Example: Fee Amount" 
          value={field.label} onChange={(e) => onChange(field.id, 'label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-mosque-primary outline-none text-sm" />
      </div>
      
      <div className="w-full md:w-1/4">
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('template.field_key')}</label>
        <input type="text" required placeholder="fee_amount" 
          value={field.key} onChange={(e) => onChange(field.id, 'key', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-mosque-primary outline-none text-sm font-mono bg-gray-50" />
      </div>
      
      {/* DATA TYPE & FORMAT AREA */}
      <div className="w-full md:w-1/4 flex flex-col gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('template.field_type')}</label>
          <select value={field.type} onChange={(e) => onChange(field.id, 'type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-mosque-primary outline-none text-sm cursor-pointer bg-white">
            <option value="text">Short Text (Text)</option>
            <option value="textarea">Long Text (Textarea)</option>
            <option value="number">Number (Quantity/Currency)</option>
            <option value="date">Date</option>
            <option value="file">File Upload (File)</option>
          </select>
        </div>

        {/* AUTO-APPEARS IF TYPE = NUMBER */}
        {field.type === 'number' && (
          <div className="animate-fade-in">
             <select 
              value={field.format || 'decimal'}
              onChange={(e) => onChange(field.id, 'format', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-md text-xs bg-blue-50 border-blue-200 text-blue-700 font-semibold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="decimal">Format: Standard Number (Qty)</option>
              <option value="currency">Format: Currency (SGD)</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="w-full md:w-[15%] flex flex-col justify-center pt-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={field.required} onChange={(e) => onChange(field.id, 'required', e.target.checked)}
            className="w-4 h-4 text-mosque-primary focus:ring-mosque-primary border-gray-300 rounded cursor-pointer accent-mosque-primary" />
          <span className="text-sm font-medium text-gray-700">{t('template.field_req')}</span>
        </label>
      </div>
    </div>
  );
}