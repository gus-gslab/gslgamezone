import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Brain,
  Target,
  Zap,
  Star,
  Users,
  Clock,
  Trophy,
  Menu,
  X,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

import LogoGSLGameZone from '../components/LogoGSLGameZone';
import LogoGSLGameZoneDark from '../components/LogoGSLGameZoneDark';
import { ThemeToggle } from '../components/ThemeToggle';
import { useStats } from '../hooks/useStats';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      time: t('home.games.wordSearch.time'),
    },
    {
      id: 'solitaire',
      title: t('home.games.solitaire.title'),
      description: t('home.games.solitaire.description'),
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      status: 'active',
      players: '2K+',
      rating: 4.9,
      category: t('home.games.solitaire.category'),
      difficulty: t('home.games.solitaire.difficulty'),
      time: t('home.games.solitaire.time'),
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
      time: t('home.games.memory.time'),
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
      time: t('home.games.crossword.time'),
    },
  ];

  const { formattedStats } = useStats();

  const stats = [
    {
      icon: Users,
      label: t('home.stats.activePlayers'),
      value: formattedStats.activePlayers,
    },
    {
      icon: Clock,
      label: t('home.stats.timePlayed'),
      value: formattedStats.timePlayed,
    },
    {
      icon: Trophy,
      label: t('home.stats.wordsFound'),
      value: formattedStats.wordsFound,
    },
    {
      icon: Star,
      label: t('home.stats.averageRating'),
      value: formattedStats.averageRating,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-bg dark:to-dark-bg light-container relative overflow-hidden">
      <SEOHead />
      {/* Efeitos de luz no background */}
      <div className="light-effect-1"></div>
      <div className="light-effect-2"></div>
      <div className="light-effect-3"></div>

      {/* Background blur com cores pastéis */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Círculo azul-roxo misturado */}
        <motion.div
          className="absolute top-20 left-10 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/40 to-purple-300/40 dark:from-blue-400/30 dark:to-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>

        {/* Círculo roxo-rosa misturado */}
        <motion.div
          className="absolute top-40 right-20 w-[700px] h-[700px] bg-gradient-to-br from-purple-300/40 to-pink-300/40 dark:from-purple-400/30 dark:to-pink-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 25, 0],
            y: [0, 50, -35, 0],
            scale: [1, 1.15, 0.95, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>

        {/* Círculo verde-azul misturado */}
        <motion.div
          className="absolute bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-green-300/40 to-blue-300/40 dark:from-green-400/30 dark:to-blue-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 35, -25, 0],
            y: [0, -45, 40, 0],
            scale: [1, 1.18, 0.92, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>

        {/* Círculo rosa-amarelo misturado */}
        <motion.div
          className="absolute bottom-20 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/40 to-yellow-300/40 dark:from-pink-400/30 dark:to-yellow-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 35, -25, 0],
            scale: [1, 1.25, 0.88, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>

        {/* Círculo amarelo-verde misturado */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-yellow-300/40 to-green-300/40 dark:from-yellow-400/30 dark:to-green-400/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            x: [0, 25, -20, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.3, 0.85, 1],
            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>
      </div>
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-200 dark:border-transparent light-content dark:bg-dark-header/95"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* Logo GSL Game Zone SVG */}
              <LogoGSLGameZone
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#games"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent font-medium text-sm"
              >
                {t('home.navigation.games')}
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent font-medium text-sm"
              >
                {t('home.navigation.about')}
              </a>
              <a
                href="mailto:gslgamezone@gmail.com"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent font-medium text-sm"
              >
                {t('home.navigation.contact')}
              </a>

              <div className="flex items-center space-x-3 ml-4">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors dark:text-dark-text dark:hover:text-dark-accent dark:hover:bg-dark-border"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-t border-gray-200 dark:border-dark-border pt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#games"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent"
                >
                  {t('home.navigation.games')}
                </a>
                <a
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent"
                >
                  {t('home.navigation.about')}
                </a>
                <a
                  href="mailto:gslgamezone@gmail.com"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors dark:text-dark-text dark:hover:text-dark-accent"
                >
                  {t('home.navigation.contact')}
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-48 px-4 sm:px-6 lg:px-8 light-content">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-dark-text mb-6">
              Free Educational Games Online. Learn Math, Logic & Language by
              Playing
            </h1>
            <p className="text-xl text-gray-600 dark:text-dark-textSecondary mb-8 max-w-3xl mx-auto">
              Discover a collection of fun and interactive games designed to
              make learning easy and engaging for kids, parents, and teachers.
              Play instantly on desktop or mobile
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#games"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-dark-card dark:to-dark-border text-white dark:text-dark-text rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {t('home.hero.cta')}
              </a>
              <motion.a
                href="#about"
                className="px-8 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-dark-accent dark:to-dark-accentHover text-gray-700 dark:text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t('home.hero.learnMore')}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-white/10 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-header/95 light-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-dark-border rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-textSecondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section
        id="games"
        className="py-32 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg light-content"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
              {t('home.games.title')}
            </h3>
            <p className="text-xl text-gray-600 dark:text-dark-textSecondary max-w-2xl mx-auto">
              {t('home.games.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                className="bg-white dark:bg-dark-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden dark:border dark:border-dark-border relative group"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}
                >
                  <game.icon className="h-12 w-12 text-white" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                      {game.title}
                    </h4>
                    {game.status === 'coming-soon' && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 text-yellow-800 text-xs rounded-full">
                        {t('home.games.comingSoon')}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-dark-textSecondary mb-4">
                    {game.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-dark-textSecondary">
                        {t('home.labels.category')}:
                      </span>
                      <span className="font-medium dark:text-dark-text">
                        {game.category}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-dark-textSecondary">
                        {t('home.labels.difficulty')}:
                      </span>
                      <span className="font-medium dark:text-dark-text">
                        {game.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-dark-textSecondary">
                        {t('home.labels.time')}:
                      </span>
                      <span className="font-medium dark:text-dark-text">
                        {game.time}
                      </span>
                    </div>
                  </div>

                  {game.status === 'active' ? (
                    <a
                      href={
                        game.id === 'solitaire'
                          ? '/solitaire-setup'
                          : '/game-setup'
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-dark-accent dark:to-dark-accentHover text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 block text-center"
                    >
                      {t('home.games.playNow')}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 dark:bg-dark-border text-gray-500 dark:text-dark-textSecondary py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
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
      <section
        id="about"
        className="py-32 bg-gray-50 dark:bg-dark-header/95 light-content"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-6">
                {t('home.about.title')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-dark-textSecondary mb-6">
                {t('home.about.description')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-dark-text">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full mr-3"></div>
                  {t('home.about.benefits.cognitive')}
                </li>
                <li className="flex items-center text-gray-700 dark:text-dark-text">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full mr-3"></div>
                  {t('home.about.benefits.concentration')}
                </li>
                <li className="flex items-center text-gray-700 dark:text-dark-text">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full mr-3"></div>
                  {t('home.about.benefits.vocabulary')}
                </li>
                <li className="flex items-center text-gray-700 dark:text-dark-text">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full mr-3"></div>
                  {t('home.about.benefits.problemSolving')}
                </li>
                <li className="flex items-center text-gray-700 dark:text-dark-text">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-dark-accent rounded-full mr-3"></div>
                  {t('home.about.benefits.motor')}
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-dark-accent dark:to-dark-accentHover rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">
                  {t('home.about.stats.title')}
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('home.about.stats.activePlayers')}</span>
                    <span className="font-bold">
                      {formattedStats.activePlayers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('home.about.stats.timePlayed')}</span>
                    <span className="font-bold">
                      {formattedStats.timePlayed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('home.about.stats.wordsFound')}</span>
                    <span className="font-bold">
                      {formattedStats.wordsFound}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('home.about.stats.averageRating')}</span>
                    <span className="font-bold">
                      {formattedStats.averageRating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h4 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
                FAQ
              </h4>
              <p className="text-lg text-gray-600 dark:text-dark-textSecondary">
                Frequently Asked Questions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    1. What are the benefits of online educational games for
                    kids?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Online educational games help children develop cognitive
                    skills like memory and focus, while also building
                    problem-solving and critical thinking. Unlike traditional
                    study methods, games make learning interactive and fun,
                    keeping kids motivated to practice daily.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    2. Are free educational games effective for learning math
                    and logic?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Yes. Free educational math and logic games allow children to
                    practice addition, subtraction, puzzles, and reasoning
                    skills in a playful way. These activities strengthen
                    classroom concepts and help students apply what they learn
                    in real situations.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    3. Do educational games improve vocabulary and language
                    skills?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Educational games that involve words, spelling, and reading
                    encourage kids to expand vocabulary, improve comprehension,
                    and develop communication skills. They provide repeated
                    exposure to new words in a fun context, which is proven to
                    accelerate language learning.
                  </p>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    4. What age group can play educational games online?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Most educational games are designed for kids from preschool
                    to middle school (ages 4 to 12), but many titles are also
                    fun for teenagers and even adults. Games can be filtered by
                    age and skill level, making them accessible to learners of
                    all backgrounds.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    5. Are online educational games safe for kids?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Yes. The educational games on our platform are safe,
                    ad-free, and require no downloads or sign-ups. Parents and
                    teachers can let children play knowing the environment is
                    secure, focused on learning, and free of distractions.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-border rounded-lg p-6 faq-card">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
                    6. How do teachers use educational games in the classroom?
                  </h5>
                  <p className="text-gray-600 dark:text-dark-textSecondary">
                    Teachers integrate educational games to review lessons,
                    encourage teamwork, and keep students engaged. By combining
                    interactive play with curriculum goals, games help students
                    retain knowledge longer and enjoy the learning process. Many
                    educators use them as warm-up activities or homework
                    alternatives.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-bg text-white py-12 light-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-start mb-4">
                <div className="flex flex-col items-center">
                  <LogoGSLGameZoneDark
                    width={150}
                    height={37}
                    className="mb-2"
                  />
                  <span className="text-sm text-gray-400">
                    {t('home.subtitle')}
                  </span>
                </div>
              </div>
              <p className="text-gray-400">{t('home.footer.description')}</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">{t('home.footer.games')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/game-setup"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.games.wordSearch.title')}
                  </a>
                </li>
                <li>
                  <a
                    href="/solitaire-setup"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.games.solitaire.title')}
                  </a>
                </li>
                <li>
                  <span className="text-gray-600">
                    {t('home.games.memory.title')} ({t('home.games.comingSoon')}
                    )
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    {t('home.games.crossword.title')} (
                    {t('home.games.comingSoon')})
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">
                {t('home.footer.resources')}
              </h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.navigation.about')}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:gslgamezone@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.navigation.contact')}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.footer.privacy')}
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    {t('home.footer.terms')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">{t('home.footer.contact')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>gslgamezone@gmail.com</li>
                <li>San Francisco, CA</li>
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
