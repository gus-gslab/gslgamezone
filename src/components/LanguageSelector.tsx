import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Closing dropdown - clicked outside');
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Usar setTimeout para evitar que o clique seja interceptado imediatamente
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    console.log('Current language before change:', i18n.language);
    
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    console.log('Language changed to:', i18n.language);
    
    // Track language change in analytics
    if (window.gameAnalytics) {
      window.gameAnalytics.trackSettingsChange('language', i18n.language, languageCode);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          console.log('Language selector button clicked, current isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-dark-text dark:hover:text-white dark:bg-dark-button dark:hover:bg-dark-accentHover h-9"
      >
        <Globe className="h-5 w-5" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border z-[9999]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked for language:', language.code);
                handleLanguageChange(language.code);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mouse down on language button:', language.code);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-border transition-colors cursor-pointer ${
                i18n.language === language.code ? 'bg-blue-50 text-blue-600 dark:bg-dark-button dark:text-dark-accent' : 'text-gray-700 dark:text-dark-text'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {i18n.language === language.code && (
                <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
