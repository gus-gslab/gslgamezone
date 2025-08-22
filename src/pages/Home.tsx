import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Target, Zap, Star, Users, Clock, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const games = [
    {
      id: 'caca-palavras',
      title: 'Caça-Palavras',
      description: 'Encontre palavras escondidas em um grid de letras',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      status: 'active',
      players: '1K+',
      rating: 4.8,
      category: 'Educativo',
      difficulty: 'Fácil',
      time: '5-15 min'
    },
    {
      id: 'coming-soon-1',
      title: 'Quebra-Cabeça',
      description: 'Monte imagens deslizando as peças',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      status: 'coming-soon',
      players: 'Em breve',
      rating: 0,
      category: 'Lógica',
      difficulty: 'Médio',
      time: '10-30 min'
    },
    {
      id: 'coming-soon-2',
      title: 'Jogo da Memória',
      description: 'Encontre pares de cartas iguais',
      icon: Target,
      color: 'from-green-500 to-teal-600',
      status: 'coming-soon',
      players: 'Em breve',
      rating: 0,
      category: 'Memória',
      difficulty: 'Fácil',
      time: '3-10 min'
    },
    {
      id: 'coming-soon-3',
      title: 'Palavras Cruzadas',
      description: 'Complete as palavras com as dicas',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      status: 'coming-soon',
      players: 'Em breve',
      rating: 0,
      category: 'Educativo',
      difficulty: 'Difícil',
      time: '15-45 min'
    }
  ];

  const stats = [
    { icon: Users, label: 'Jogadores Ativos', value: '1,234' },
    { icon: Clock, label: 'Tempo Jogado', value: '2,567h' },
    { icon: Trophy, label: 'Palavras Encontradas', value: '45,678' },
    { icon: Star, label: 'Avaliação Média', value: '4.8/5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                  Jogos Educativos
                </h1>
                <p className="text-sm text-gray-600">Aprenda brincando</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#games" className="text-gray-700 hover:text-blue-600 transition-colors">Jogos</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Sobre</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
            </nav>
          </div>
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
              Aprenda de Forma
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Divertida</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nossa coleção de jogos educativos foi criada para tornar o aprendizado 
              uma experiência envolvente e interativa para todas as idades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#games"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Começar a Jogar
              </a>
              <a
                href="#about"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                Saiba Mais
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
                animate={{ opacity: 1, y: 0 }}
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
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Nossos Jogos</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção crescente de jogos educativos, 
              cada um projetado para desenvolver habilidades específicas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        Em breve
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
                      href="/caca-palavras"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 block text-center"
                    >
                      Jogar Agora
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Em Breve
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
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Por que Jogos Educativos?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Acreditamos que o aprendizado deve ser divertido e envolvente. 
                Nossos jogos são desenvolvidos com base em princípios educacionais 
                comprovados, combinando diversão com desenvolvimento de habilidades.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Desenvolvimento cognitivo e memória
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Melhoria da concentração e foco
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Aprendizado de vocabulário e linguagem
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Desenvolvimento de habilidades motoras
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">Estatísticas Impressionantes</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Jogadores Ativos</span>
                    <span className="font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo Jogado</span>
                    <span className="font-bold">2,567h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Palavras Encontradas</span>
                    <span className="font-bold">45,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avaliação Média</span>
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
                <span className="text-xl font-bold">Jogos Educativos</span>
              </div>
              <p className="text-gray-400">
                Aprenda brincando com nossa coleção de jogos educativos.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Jogos</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/caca-palavras" className="hover:text-white transition-colors">Caça-Palavras</a></li>
                <li><span className="text-gray-600">Quebra-Cabeça (Em breve)</span></li>
                <li><span className="text-gray-600">Jogo da Memória (Em breve)</span></li>
                <li><span className="text-gray-600">Palavras Cruzadas (Em breve)</span></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Recursos</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <ul className="space-y-2 text-gray-400">
                <li>contato@jogoseducativos.com</li>
                <li>+55 (11) 99999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jogos Educativos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
