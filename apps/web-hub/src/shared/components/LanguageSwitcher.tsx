import { useTranslation } from 'react-i18next';

type Language = 'en' | 'hi' | 'te';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as Language;

  const setLang = (l: Language) => {
    i18n.changeLanguage(l);
  };

  return (
    <div 
      className="flex items-center gap-1 bg-stone-100/50 p-1 rounded-xl border border-stone-200/60 backdrop-blur-sm"
      role="group"
      aria-label="Language Selector"
    >
      {(['en', 'hi', 'te'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
            currentLang === l 
              ? 'bg-vermilion text-white shadow-md' 
              : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
