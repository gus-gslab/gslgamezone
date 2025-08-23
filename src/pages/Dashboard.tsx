import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  Eye,
  MousePointer,
  Trophy,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  fetchAnalyticsData,
  getGameStatsFromStorage,
} from '../services/analyticsService';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  topCountries: Array<{ country: string; visitors: number }>;
  topPages: Array<{ page: string; views: number }>;
  gameStats: {
    totalGames: number;
    totalWordsFound: number;
    averageScore: number;
    completionRate: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    topCountries: [],
    topPages: [],
    gameStats: {
      totalGames: 0,
      totalWordsFound: 0,
      averageScore: 0,
      completionRate: 0,
    },
    recentActivity: [],
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Load real data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Fetch Analytics data
        const analyticsData = await fetchAnalyticsData(timeRange);

        // Get game stats from localStorage
        const gameStats = getGameStatsFromStorage();

        // Combine data
        setData({
          ...analyticsData,
          gameStats: {
            totalGames: gameStats.totalGames,
            totalWordsFound: gameStats.totalWordsFound,
            averageScore: gameStats.averageScore,
            completionRate: gameStats.completionRate,
          },
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // In case of error, use zeroed data
        setData({
          pageViews: 0,
          uniqueVisitors: 0,
          averageTimeOnPage: 0,
          topCountries: [
            { country: 'Brazil', visitors: 0 },
            { country: 'United States', visitors: 0 },
            { country: 'Portugal', visitors: 0 },
            { country: 'Spain', visitors: 0 },
            { country: 'Argentina', visitors: 0 },
          ],
          topPages: [
            { page: '/', views: 0 },
            { page: '/caca-palavras', views: 0 },
            { page: '/game-setup', views: 0 },
            { page: '/about', views: 0 },
          ],
          gameStats: {
            totalGames: 0,
            totalWordsFound: 0,
            averageScore: 0,
            completionRate: 0,
          },
          recentActivity: [],
        });
      }

      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'game_complete':
        return <Trophy className="text-yellow-500" size={16} />;
      case 'word_found':
        return <MousePointer className="text-blue-500" size={16} />;
      case 'achievement_unlocked':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'game_start':
        return <Eye className="text-purple-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={32}
          />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Analytics
                </h1>
                <p className="text-sm text-gray-500">
                  Métricas e insights do GSL Game Zone
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1d">Últimas 24h</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem Informativa */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={20} />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Dashboard Analytics
              </h3>
              <p className="text-sm text-blue-700">
                Dados reais do Google Analytics serão exibidos conforme o
                tráfego aumenta. Estatísticas do jogo são carregadas do
                localStorage dos usuários.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Visualizações
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.pageViews)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-xs">Dados em tempo real</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Visitantes Únicos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.uniqueVisitors)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-xs">Dados em tempo real</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(data.averageTimeOnPage)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-xs">Dados em tempo real</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Jogos Completados
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.gameStats.totalGames)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-xs">Dados em tempo real</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estatísticas do Jogo */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Estatísticas do Jogo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Total de Jogos
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatNumber(data.gameStats.totalGames)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Palavras Encontradas
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatNumber(data.gameStats.totalWordsFound)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Pontuação Média
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatNumber(data.gameStats.averageScore)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Taxa de Conclusão
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {data.gameStats.completionRate}%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Páginas Mais Visitadas
                </h3>
                {data.topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {page.page}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatNumber(page.views)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Atividade Recente */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Atividade Recente
            </h2>

            <div className="space-y-4">
              {data.recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getActionIcon(activity.action)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Países */}
        <motion.div
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Visitantes por País
            </h2>
            <MapPin className="text-gray-400" size={20} />
          </div>

          <div className="space-y-3">
            {data.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    {country.country}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (country.visitors / data.topCountries[0].visitors) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-16 text-right">
                    {formatNumber(country.visitors)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
