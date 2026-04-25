// src/components/molecules/template/TemplateBasicInfo.jsx
import { useTranslation } from 'react-i18next';

export default function TemplateBasicInfo({ code, setCode, name, setName }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('template.code')}</label>
        <input type="text" required placeholder="FRM-LEAVE-01" 
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none text-sm uppercase" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('template.name')}</label>
        <input type="text" required placeholder="Leave Request Form" 
          value={name} onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none text-sm" />
      </div>
    </div>
  );
}