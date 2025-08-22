import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Brain, Target, Zap, Star, Users, Clock, Trophy, Menu, X } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import LanguageSelector from '../components/LanguageSelector';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Remover o useEffect que força a detecção de idioma
  // O i18n já detecta automaticamente e reage às mudanças
  
  const games = [
    {
      id: 'caca-palavras',
      title: t('home.games.wordSearch.title'),
      description: t('home.games.wordSearch.description'),
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      status: 'active',
      players: '1K+',
      rating: 4.8,
      category: t('home.games.wordSearch.category'),
      difficulty: t('home.games.wordSearch.difficulty'),
      time: t('home.games.wordSearch.time')
    },
    {
      id: 'coming-soon-1',
      title: t('home.games.puzzle.title'),
      description: t('home.games.puzzle.description'),
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      status: 'coming-soon',
      players: t('home.games.comingSoon'),
      rating: 0,
      category: t('home.games.puzzle.category'),
      difficulty: t('home.games.puzzle.difficulty'),
      time: t('home.games.puzzle.time')
    },
    {
      id: 'coming-soon-2',
      title: t('home.games.memory.title'),
      description: t('home.games.memory.description'),
      icon: Target,
      color: 'from-green-500 to-teal-600',
      status: 'coming-soon',
      players: t('home.games.comingSoon'),
      rating: 0,
      category: t('home.games.memory.category'),
      difficulty: t('home.games.memory.difficulty'),
      time: t('home.games.memory.time')
    },
    {
      id: 'coming-soon-3',
      title: t('home.games.crossword.title'),
      description: t('home.games.crossword.description'),
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      status: 'coming-soon',
      players: t('home.games.comingSoon'),
      rating: 0,
      category: t('home.games.crossword.category'),
      difficulty: t('home.games.crossword.difficulty'),
      time: t('home.games.crossword.time')
    }
  ];

  const stats = [
    { icon: Users, label: t('home.stats.activePlayers'), value: '1,234' },
    { icon: Clock, label: t('home.stats.timePlayed'), value: '2,567h' },
    { icon: Trophy, label: t('home.stats.wordsFound'), value: '45,678' },
    { icon: Star, label: t('home.stats.averageRating'), value: '4.8/5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SEOHead />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                  {t('home.title')}
                </h1>
                <p className="text-sm text-gray-600">{t('home.subtitle')}</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#games" className="text-gray-700 hover:text-blue-600 transition-colors">{t('home.navigation.games')}</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">{t('home.navigation.about')}</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">{t('home.navigation.contact')}</a>
              <LanguageSelector />
            </nav>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-t border-gray-200 pt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                <a 
                  href="#games" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('home.navigation.games')}
                </a>
                <a 
                  href="#about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('home.navigation.about')}
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {t('home.navigation.contact')}
                </a>
                <div className="pt-2 border-t border-gray-200">
                  <LanguageSelector />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.hero.title')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{t('home.hero.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#games"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {t('home.hero.cta')}
              </a>
              <a
                href="#about"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                {t('home.hero.learnMore')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('home.games.title')}</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.games.description')}
            </p>
          </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                  <game.icon className="h-12 w-12 text-white" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-900">{game.title}</h4>
                    {game.status === 'coming-soon' && (
                                           <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                       {t('home.games.comingSoon')}
                     </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Categoria:</span>
                      <span className="font-medium">{game.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dificuldade:</span>
                      <span className="font-medium">{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tempo:</span>
                      <span className="font-medium">{game.time}</span>
                    </div>
                  </div>

                  {game.status === 'active' ? (
                    <a
                      href="/game-setup"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 block text-center"
                    >
                                             {t('home.games.playNow')}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                                             {t('home.games.comingSoon')}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
                             <h3 className="text-4xl font-bold text-gray-900 mb-6">
                 {t('home.about.title')}
               </h3>
               <p className="text-lg text-gray-600 mb-6">
                 {t('home.about.description')}
               </p>
               <ul className="space-y-3">
                 <li className="flex items-center text-gray-700">
                   <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                   {t('home.about.benefits.cognitive')}
                 </li>
                 <li className="flex items-center text-gray-700">
                   <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                   {t('home.about.benefits.concentration')}
                 </li>
                 <li className="flex items-center text-gray-700">
                   <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                   {t('home.about.benefits.vocabulary')}
                 </li>
                 <li className="flex items-center text-gray-700">
                   <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                   {t('home.about.benefits.motor')}
                 </li>
               </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                                 <h4 className="text-2xl font-bold mb-4">{t('home.about.stats.title')}</h4>
                 <div className="space-y-4">
                   <div className="flex justify-between">
                     <span>{t('home.about.stats.activePlayers')}</span>
                     <span className="font-bold">1,234</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{t('home.about.stats.timePlayed')}</span>
                     <span className="font-bold">2,567h</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{t('home.about.stats.wordsFound')}</span>
                     <span className="font-bold">45,678</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{t('home.about.stats.averageRating')}</span>
                     <span className="font-bold">4.8/5</span>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">GSL Game Zone</span>
                  <p className="text-xs text-gray-500 mt-1">{t('home.subtitle')}</p>
                </div>
              </div>
                             <p className="text-gray-400">
                 {t('home.footer.description')}
               </p>
            </div>
            
                         <div>
               <h5 className="font-semibold mb-4">{t('home.footer.games')}</h5>
               <ul className="space-y-2 text-gray-400">
                 <li><a href="/caca-palavras" className="hover:text-white transition-colors">{t('home.games.wordSearch.title')}</a></li>
                 <li><span className="text-gray-600">{t('home.games.puzzle.title')} ({t('home.games.comingSoon')})</span></li>
                 <li><span className="text-gray-600">{t('home.games.memory.title')} ({t('home.games.comingSoon')})</span></li>
                 <li><span className="text-gray-600">{t('home.games.crossword.title')} ({t('home.games.comingSoon')})</span></li>
               </ul>
             </div>
             
             <div>
               <h5 className="font-semibold mb-4">{t('home.footer.resources')}</h5>
               <ul className="space-y-2 text-gray-400">
                 <li><a href="#about" className="hover:text-white transition-colors">{t('home.navigation.about')}</a></li>
                 <li><a href="#contact" className="hover:text-white transition-colors">{t('home.navigation.contact')}</a></li>
                 <li><a href="/privacy" className="hover:text-white transition-colors">{t('home.footer.privacy')}</a></li>
                 <li><a href="/terms" className="hover:text-white transition-colors">{t('home.footer.terms')}</a></li>
               </ul>
             </div>
            
                                     <div>
              <h5 className="font-semibold mb-4">{t('home.footer.contact')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>gslgamezone@gmail.com</li>
                <li>San Jose, CA</li>
                <li>Rio de Janeiro, BR</li>
                <li>Barcelona, ES</li>
              </ul>
            </div>
          </div>
          
                     <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
             <p>{t('home.footer.copyright')}</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
