import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Settings, Target, Star, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface GameConfig {
  language: string;
  gridSize: string;
  difficulty: string;
  category: string;
}

const GameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  
  // Configuração inicial baseada na URL ou padrões
  const [config, setConfig] = useState<GameConfig>({
    language: searchParams.get('lang') || 'pt',
    gridSize: searchParams.get('size') || 'medium',
    difficulty: searchParams.get('difficulty') || 'easy',
    category: searchParams.get('category') || 'animals'
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Presets pré-configurados
  const presets = [
    {
      id: 'beginner',
      name: 'Iniciante',
      description: 'Perfeito para começar',
      icon: '🌟',
      config: { language: 'pt', gridSize: 'small', difficulty: 'easy', category: 'animals' }
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Para jogar relaxadamente',
      icon: '😌',
      config: { language: 'pt', gridSize: 'medium', difficulty: 'easy', category: 'colors' }
    },
    {
      id: 'challenge',
      name: 'Desafio',
      description: 'Para jogadores experientes',
      icon: '🔥',
      config: { language: 'pt', gridSize: 'large', difficulty: 'medium', category: 'technology' }
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Para os verdadeiros mestres',
      icon: '👑',
      config: { language: 'pt', gridSize: 'large', difficulty: 'hard', category: 'professions' }
    }
  ];

  const categories = {
    animals: { name: 'Animais', icon: '🐾', color: 'from-green-400 to-green-600' },
    colors: { name: 'Cores', icon: '🎨', color: 'from-pink-400 to-pink-600' },
    foods: { name: 'Comidas', icon: '🍽️', color: 'from-orange-400 to-orange-600' },
    technology: { name: 'Tecnologia', icon: '💻', color: 'from-blue-400 to-blue-600' },
    professions: { name: 'Profissões', icon: '👨‍⚕️', color: 'from-purple-400 to-purple-600' },
    sports: { name: 'Esportes', icon: '⚽', color: 'from-red-400 to-red-600' },
    music: { name: 'Música', icon: '🎵', color: 'from-indigo-400 to-indigo-600' },
    nature: { name: 'Natureza', icon: '🌿', color: 'from-emerald-400 to-emerald-600' }
  };

  const difficulties = [
    { value: 'easy', name: 'Fácil', icon: '🟢', description: 'Palavras simples e curtas' },
    { value: 'medium', name: 'Médio', icon: '🟡', description: 'Palavras intermediárias' },
    { value: 'hard', name: 'Difícil', icon: '🔴', description: 'Palavras complexas e longas' }
  ];

  const gridSizes = [
    { value: 'small', name: 'Pequeno', icon: '🔹', description: '10x12 - 6 palavras' },
    { value: 'medium', name: 'Médio', icon: '🔸', description: '12x15 - 8 palavras' },
    { value: 'large', name: 'Grande', icon: '🔶', description: '14x18 - 10 palavras' }
  ];

  const languages = [
    { value: 'pt', name: 'Português', flag: '🇧🇷' },
    { value: 'en', name: 'English', flag: '🇺🇸' },
    { value: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handlePresetSelect = (preset: any) => {
    setConfig(preset.config);
    setSelectedPreset(preset.id);
  };

  const handleStartGame = () => {
    const params = new URLSearchParams({
      lang: config.language,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleBackToHome}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Configurar Jogo</h1>
                <p className="text-sm text-gray-500">Personalize sua experiência</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Target size={16} />
              <span>Caça-Palavras</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Configurações */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Presets Rápidos */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                Presets Rápidos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{preset.name}</div>
                        <div className="text-sm text-gray-500">{preset.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Configurações Personalizadas */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="text-blue-500" size={20} />
                Configurações Personalizadas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Idioma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Idioma
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
                    Categoria
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
                    Dificuldade
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
                    Tamanho do Grid
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
                Preview da Configuração
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Idioma:</span>
                  <span className="font-medium">{languages.find(l => l.value === config.language)?.flag} {languages.find(l => l.value === config.language)?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <span className="font-medium">{categories[config.category as keyof typeof categories]?.icon} {categories[config.category as keyof typeof categories]?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Dificuldade:</span>
                  <span className="font-medium">{difficulties.find(d => d.value === config.difficulty)?.icon} {difficulties.find(d => d.value === config.difficulty)?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Grid:</span>
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
                <h3 className="text-lg font-semibold mb-2">Pronto para Jogar?</h3>
                <p className="text-blue-100 text-sm">
                  Clique em iniciar para começar sua aventura de caça-palavras!
                </p>
              </div>
              
              <motion.button
                onClick={handleStartGame}
                className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={24} />
                Iniciar Jogo
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
                  <div className="font-medium text-yellow-800 mb-1">💡 Dica</div>
                  <div className="text-yellow-700">
                    Comece com o preset "Iniciante" se for sua primeira vez. 
                    Você pode sempre ajustar as configurações depois!
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
