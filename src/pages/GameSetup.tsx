import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Settings, Target, Star, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../components/ThemeToggle';

interface GameConfig {
  language: string;
  gridSize: string;
  difficulty: string;
  category: string;
}

const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { i18n, t } = useTranslation();

  // Configuração inicial baseada na URL ou idioma atual
  const [config, setConfig] = useState<GameConfig>(() => {
    const urlLang = searchParams.get('lang');
    const storedLang = localStorage.getItem('i18nextLng');
    const currentLang = i18n.language;
    
    return {
      language: urlLang || storedLang || currentLang || 'pt',
      gridSize: searchParams.get('size') || 'medium',
      difficulty: searchParams.get('difficulty') || 'easy',
      category: searchParams.get('category') || 'animals'
    };
  });

  // Sincronizar configuração com o idioma atual
  useEffect(() => {
    const currentLang = i18n.language;
    
    if (currentLang && ['pt', 'en', 'es'].includes(currentLang)) {
      // Sempre atualizar config para refletir o idioma atual
      setConfig(prev => ({ ...prev, language: currentLang }));
    }
  }, [i18n.language]);

  // Forçar sincronização na montagem do componente
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    
    if (storedLang && ['pt', 'en', 'es'].includes(storedLang)) {
      setConfig(prev => ({ ...prev, language: storedLang }));
    }
  }, []);

  // Forçar sincronização com i18n quando disponível
  useEffect(() => {
    if (i18n.isInitialized) {
      const currentLang = i18n.language;
      if (currentLang && ['pt', 'en', 'es'].includes(currentLang)) {
        setConfig(prev => ({ ...prev, language: currentLang }));
      }
    }
  }, [i18n.isInitialized, i18n.language]);

  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Presets pré-configurados
  const presets = [
    {
      id: 'beginner',
      name: t('gameSetup.presets.beginner.name'),
      description: t('gameSetup.presets.beginner.description'),
      icon: '🌟',
      config: { language: config.language, gridSize: 'small', difficulty: 'easy', category: 'animals' }
    },
    {
      id: 'casual',
      name: t('gameSetup.presets.casual.name'),
      description: t('gameSetup.presets.casual.description'),
      icon: '😌',
      config: { language: config.language, gridSize: 'medium', difficulty: 'easy', category: 'colors' }
    },
    {
      id: 'challenge',
      name: t('gameSetup.presets.challenge.name'),
      description: t('gameSetup.presets.challenge.description'),
      icon: '🔥',
      config: { language: config.language, gridSize: 'large', difficulty: 'medium', category: 'technology' }
    },
    {
      id: 'expert',
      name: t('gameSetup.presets.expert.name'),
      description: t('gameSetup.presets.expert.description'),
      icon: '👑',
      config: { language: config.language, gridSize: 'large', difficulty: 'hard', category: 'professions' }
    }
  ];

  const categories = {
    animals: { name: t('gameSetup.categories.animals'), icon: '🐾', color: 'from-green-400 to-green-600' },
    colors: { name: t('gameSetup.categories.colors'), icon: '🎨', color: 'from-pink-400 to-pink-600' },
    foods: { name: t('gameSetup.categories.foods'), icon: '🍽️', color: 'from-orange-400 to-orange-600' },
    technology: { name: t('gameSetup.categories.technology'), icon: '💻', color: 'from-blue-400 to-blue-600' },
    professions: { name: t('gameSetup.categories.professions'), icon: '👨‍⚕️', color: 'from-purple-400 to-purple-600' },
    sports: { name: t('gameSetup.categories.sports'), icon: '⚽', color: 'from-red-400 to-red-600' },
    music: { name: t('gameSetup.categories.music'), icon: '🎵', color: 'from-indigo-400 to-indigo-600' },
    nature: { name: t('gameSetup.categories.nature'), icon: '🌿', color: 'from-emerald-400 to-emerald-600' }
  };

  const difficulties = [
    { value: 'easy', name: t('gameSetup.difficulties.easy'), icon: '🟢', description: t('gameSetup.difficulties.easyDesc') },
    { value: 'medium', name: t('gameSetup.difficulties.medium'), icon: '🟡', description: t('gameSetup.difficulties.mediumDesc') },
    { value: 'hard', name: t('gameSetup.difficulties.hard'), icon: '🔴', description: t('gameSetup.difficulties.hardDesc') }
  ];

  const gridSizes = [
    { value: 'small', name: t('gameSetup.gridSizes.small'), icon: '🔹', description: t('gameSetup.gridSizes.smallDesc') },
    { value: 'medium', name: t('gameSetup.gridSizes.medium'), icon: '🔸', description: t('gameSetup.gridSizes.mediumDesc') },
    { value: 'large', name: t('gameSetup.gridSizes.large'), icon: '🔶', description: t('gameSetup.gridSizes.largeDesc') }
  ];

  const languages = [
    { value: 'pt', name: t('gameSetup.languages.pt'), flag: '🇧🇷' },
    { value: 'en', name: t('gameSetup.languages.en'), flag: '🇺🇸' },
    { value: 'es', name: t('gameSetup.languages.es'), flag: '🇪🇸' }
  ];

  const handlePresetSelect = (preset: any) => {
    // Manter o idioma atual ao selecionar preset
    const updatedConfig = { ...preset.config, language: config.language };
    setConfig(updatedConfig);
    setSelectedPreset(preset.id);
  };

  const handleStartGame = () => {
    // Garantir que o idioma seja o atual
    const currentLanguage = config.language || i18n.language || 'pt';
    const params = new URLSearchParams({
      lang: currentLanguage,
      size: config.gridSize,
      difficulty: config.difficulty,
      category: config.category
    });
    
    navigate(`/caca-palavras?${params.toString()}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg light-container">
      {/* Efeitos de luz no background */}
      <div className="light-effect-1"></div>
      <div className="light-effect-2"></div>
      <div className="light-effect-3"></div>
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-100 dark:bg-dark-header dark:border-transparent light-content"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleBackToHome}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-dark-border dark:hover:bg-dark-accent dark:text-dark-text"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={18} className="text-gray-600 dark:text-dark-text" />
              </motion.button>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text">{t('gameSetup.title')}</h1>
                <p className="text-xs text-gray-500 dark:text-dark-textSecondary">{t('gameSetup.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-textSecondary">
                <Target size={14} />
                <span className="text-xs font-medium">{t('gameSetup.gameName')}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8 light-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Configurações */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Presets Rápidos */}
            <motion.div 
              className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                {t('gameSetup.presets.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50 dark:border-dark-accent dark:bg-dark-border'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-dark-border dark:hover:border-dark-accent dark:hover:bg-dark-border'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-dark-text">{preset.name}</div>
                        <div className="text-sm text-gray-500 dark:text-dark-textSecondary">{preset.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Configurações Personalizadas */}
            <motion.div 
              className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4 flex items-center gap-2">
                <Settings className="text-blue-500" size={20} />
                {t('gameSetup.custom.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Idioma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('gameSetup.custom.language')}
                  </label>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setConfig({ ...config, language: lang.value })}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          config.language === lang.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('gameSetup.custom.category')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(categories).map(([key, cat]) => (
                      <button
                        key={key}
                        onClick={() => setConfig({ ...config, category: key })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                          config.category === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl mb-1">{cat.icon}</div>
                        <div className="text-xs font-medium">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dificuldade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('gameSetup.custom.difficulty')}
                  </label>
                  <div className="space-y-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => setConfig({ ...config, difficulty: diff.value })}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          config.difficulty === diff.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{diff.icon}</span>
                          <div>
                            <div className="font-medium">{diff.name}</div>
                            <div className="text-xs text-gray-500">{diff.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tamanho do Grid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('gameSetup.custom.gridSize')}
                  </label>
                  <div className="space-y-2">
                    {gridSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setConfig({ ...config, gridSize: size.value })}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          config.gridSize === size.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{size.icon}</span>
                          <div>
                            <div className="font-medium">{size.name}</div>
                            <div className="text-xs text-gray-500">{size.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Preview e Iniciar */}
          <div className="space-y-6">
            
            {/* Preview da Configuração */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="text-green-500" size={20} />
                {t('gameSetup.preview.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-600">{t('gameSetup.preview.language')}:</span>
                  <span className="font-medium">{languages.find(l => l.value === config.language)?.flag} {languages.find(l => l.value === config.language)?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-600">{t('gameSetup.preview.category')}:</span>
                  <span className="font-medium">{categories[config.category as keyof typeof categories]?.icon} {categories[config.category as keyof typeof categories]?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-600">{t('gameSetup.preview.difficulty')}:</span>
                  <span className="font-medium">{difficulties.find(d => d.value === config.difficulty)?.icon} {difficulties.find(d => d.value === config.difficulty)?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-sm text-gray-600">{t('gameSetup.preview.gridSize')}:</span>
                  <span className="font-medium">{gridSizes.find(s => s.value === config.gridSize)?.icon} {gridSizes.find(s => s.value === config.gridSize)?.name}</span>
                </div>
              </div>
            </motion.div>

            {/* Botão Iniciar */}
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-center text-white mb-4">
                <div className="text-2xl mb-2">🎮</div>
                <h3 className="text-lg font-semibold mb-2">{t('gameSetup.readyToPlay')}</h3>
                <p className="text-blue-100 text-sm">
                  {t('gameSetup.startDescription')}
                </p>
              </div>
              
              <motion.button
                onClick={handleStartGame}
                className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={24} />
                {t('gameSetup.startGame')}
              </motion.button>
            </motion.div>

            {/* Dicas */}
            <motion.div 
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <Star className="text-yellow-600 mt-1" size={16} />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800 mb-1">{t('gameSetup.tipTitle')}</div>
                  <div className="text-yellow-700">
                    {t('gameSetup.tipDescription')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;

