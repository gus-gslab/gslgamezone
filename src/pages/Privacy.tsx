import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ThemeToggle } from '../components/ThemeToggle';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Remover o useEffect que força a detecção de idioma
  // O i18n já detecta automaticamente e reage às mudanças

  const handleBackToHome = () => {
    navigate('/');
  };

  const sections = [
    'infoCollection',
    'infoUsage',
    'cookies',
    'analytics',
    'security',
    'rights',
    'children',
    'changes',
    'contact',
  ];

  return (
    <>
      <SEOHead
        pageTitle={`${t('privacy.title')} - GSL Game Zone`}
        pageDescription={`${t(
          'privacy.title'
        )} do GSL Game Zone. Saiba como protegemos e utilizamos suas informações pessoais.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-bg dark:to-dark-bg light-container">
        {/* Efeitos de luz no background */}
        <div className="light-effect-1"></div>
        <div className="light-effect-2"></div>
        <div className="light-effect-3"></div>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-dark-header dark:border-transparent light-content">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleBackToHome}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-dark-border dark:hover:bg-dark-accent dark:text-dark-text"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft
                    size={18}
                    className="text-gray-600 dark:text-dark-text"
                  />
                </motion.button>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 dark:bg-dark-accent rounded-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text">
                      {t('privacy.title')}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                      {t('privacy.lastUpdated')}
                    </p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-dark-content dark:border-dark-border light-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 space-y-6">
              {sections.map((sectionKey, index) => (
                <motion.div
                  key={sectionKey}
                  className="border-b border-gray-100 dark:border-dark-border pb-6 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">
                    {t(`privacy.sections.${sectionKey}.title`)}
                  </h2>
                  <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                    {t(`privacy.sections.${sectionKey}.content`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Privacy;
