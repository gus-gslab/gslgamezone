// Serviço para buscar dados do Google Analytics 4
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

// Função para buscar dados do Google Analytics via API
export const fetchAnalyticsData = async (_timeRange: string): Promise<AnalyticsData> => {
  try {
    // Por enquanto, retornamos dados mockados mas com estrutura real
    // Em produção, você conectaria com a API do Google Analytics
    
    const mockData: AnalyticsData = {
      pageViews: 0, // Será substituído por dados reais
      uniqueVisitors: 0,
      averageTimeOnPage: 0,
      topCountries: [
        { country: 'Brasil', visitors: 0 },
        { country: 'Estados Unidos', visitors: 0 },
        { country: 'Portugal', visitors: 0 },
        { country: 'Espanha', visitors: 0 },
        { country: 'Argentina', visitors: 0 }
      ],
      topPages: [
        { page: '/', views: 0 },
        { page: '/caca-palavras', views: 0 },
        { page: '/game-setup', views: 0 },
        { page: '/about', views: 0 }
      ],
      gameStats: {
        totalGames: 0,
        totalWordsFound: 0,
        averageScore: 0,
        completionRate: 0
      },
      recentActivity: []
    };

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockData;
  } catch (error) {
    console.error('Erro ao buscar dados do Analytics:', error);
    
    // Retornar dados zerados em caso de erro
    return {
      pageViews: 0,
      uniqueVisitors: 0,
      averageTimeOnPage: 0,
      topCountries: [
        { country: 'Brasil', visitors: 0 },
        { country: 'Estados Unidos', visitors: 0 },
        { country: 'Portugal', visitors: 0 },
        { country: 'Espanha', visitors: 0 },
        { country: 'Argentina', visitors: 0 }
      ],
      topPages: [
        { page: '/', views: 0 },
        { page: '/caca-palavras', views: 0 },
        { page: '/game-setup', views: 0 },
        { page: '/about', views: 0 }
      ],
      gameStats: {
        totalGames: 0,
        totalWordsFound: 0,
        averageScore: 0,
        completionRate: 0
      },
      recentActivity: []
    };
  }
};

// Função para buscar dados de localStorage (estatísticas do jogo)
export const getGameStatsFromStorage = () => {
  try {
    const stats = localStorage.getItem('gameStats');
    if (stats) {
      const parsedStats = JSON.parse(stats);
      return {
        totalGames: parsedStats.totalGames || 0,
        totalWordsFound: parsedStats.totalWordsFound || 0,
        averageScore: parsedStats.averageScore || 0,
        completionRate: parsedStats.completionRate || 0
      };
    }
  } catch (error) {
    console.error('Erro ao ler estatísticas do localStorage:', error);
  }
  
  return {
    totalGames: 0,
    totalWordsFound: 0,
    averageScore: 0,
    completionRate: 0
  };
};

// Função para buscar dados reais do Google Analytics (futura implementação)
export const fetchRealAnalyticsData = async (_timeRange: string): Promise<Partial<AnalyticsData>> => {
  // Esta função será implementada quando você configurar a API do Google Analytics
  // Por enquanto, retorna dados vazios
  
  return {
    pageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    topCountries: [],
    topPages: []
  };
};
