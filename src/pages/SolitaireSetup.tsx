import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Play,
  Target,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface SolitaireConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  autoComplete: boolean;
  hints: boolean;
  animations: boolean;
  sound: boolean;
  drawCount: 1 | 3;
}

const SolitaireSetup: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const [config, setConfig] = useState<SolitaireConfig>({
    difficulty: 'medium',
    autoComplete: false,
    hints: true,
    animations: true,
    sound: false,
    drawCount: 3,
  });

  const difficulties = [
    {
      value: 'easy',
      name: 'Easy',
      icon: '🟢',
      description: 'More time, easier moves',
      color: 'from-green-400 to-green-600',
    },
    {
      value: 'medium',
      name: 'Medium',
      icon: '🟡',
      description: 'Balanced challenge',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      value: 'hard',
      name: 'Hard',
      icon: '🔴',
      description: 'Maximum challenge',
      color: 'from-red-400 to-red-600',
    },
  ];

  const handleStartGame = () => {
    // Salvar configurações no localStorage
    localStorage.setItem('solitaire-config', JSON.stringify(config));

    // Navegar para o jogo
    navigate('/solitaire');
  };

  const handleReset = () => {
    setConfig({
      difficulty: 'medium',
      autoComplete: false,
      hints: true,
      animations: true,
      sound: false,
      drawCount: 3,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <SEOHead
        pageTitle="Solitaire Setup | Configure Your Game | GSL Game Zone"
        pageDescription="Configure your Solitaire game! Choose difficulty, settings and preferences. Customize your card game experience with GSL Game Zone."
        pageKeywords="solitaire setup, card game configuration, solitaire settings, game customization, GSL Game Zone"
      />

      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBackToHome}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </motion.button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Settings className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Solitaire Setup
                </h1>
                <p className="text-xs text-gray-500">Klondike Solitaire</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Target size={14} />
                <span className="text-xs font-medium">Klondike Solitaire</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dificuldade */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Difficulty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {difficulties.map(diff => (
                  <button
                    key={diff.value}
                    onClick={() =>
                      setConfig({ ...config, difficulty: diff.value as any })
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      config.difficulty === diff.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{diff.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {diff.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {diff.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Configurações do Jogo */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Game Settings
              </h2>
              <div className="space-y-4">
                {/* Draw Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cards to Draw
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfig({ ...config, drawCount: 1 })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        config.drawCount === 1
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      1 Card
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, drawCount: 3 })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        config.drawCount === 3
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      3 Cards
                    </button>
                  </div>
                </div>

                {/* Auto Complete */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      Auto-complete
                    </div>
                    <div className="text-sm text-gray-500">
                      Automatically move cards to foundations
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        autoComplete: !config.autoComplete,
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${
                      config.autoComplete ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all ${
                        config.autoComplete
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Hints */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Hints</div>
                    <div className="text-sm text-gray-500">
                      Show possible moves
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setConfig({ ...config, hints: !config.hints })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${
                      config.hints ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all ${
                        config.hints ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Animations</div>
                    <div className="text-sm text-gray-500">
                      Smooth card movements
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setConfig({ ...config, animations: !config.animations })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${
                      config.animations ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all ${
                        config.animations ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      Sound Effects
                    </div>
                    <div className="text-sm text-gray-500">
                      Audio feedback for moves
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setConfig({ ...config, sound: !config.sound });
                      // Som de feedback para o toggle
                      if (!config.sound) {
                        const audio = new Audio(
                          'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT'
                        );
                        audio.play().catch(() => {});
                      }
                    }}
                    className={`w-12 h-6 rounded-full transition-all ${
                      config.sound ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all ${
                        config.sound ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Game Preview
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className="font-medium">
                    {
                      difficulties.find(d => d.value === config.difficulty)
                        ?.icon
                    }{' '}
                    {
                      difficulties.find(d => d.value === config.difficulty)
                        ?.name
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Draw Count:</span>
                  <span className="font-medium">
                    {config.drawCount} Card{config.drawCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Auto-complete:</span>
                  <span className="font-medium">
                    {config.autoComplete ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Hints:</span>
                  <span className="font-medium">
                    {config.hints ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Botão Iniciar */}
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-center text-white mb-4">
                <h3 className="text-lg font-semibold mb-2">Ready to Play!</h3>
                <p className="text-purple-100 text-sm">
                  Start your Solitaire game with these settings
                </p>
              </div>

              <motion.button
                onClick={handleStartGame}
                className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Play size={16} />
                  Start Game
                </div>
              </motion.button>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                <HelpCircle size={16} />
                Help
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolitaireSetup;
