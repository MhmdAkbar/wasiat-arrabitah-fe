import { useTranslation } from 'react-i18next';

export default function LangToggle() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLang}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-mosque-dark border border-gray-200 shadow-sm hover:bg-gray-50 transition font-bold text-sm"
      title="Toggle Language"
    >
      {i18n.language === 'en' ? 'ID' : 'EN'}
    </button>
  );
}