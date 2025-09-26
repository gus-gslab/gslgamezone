interface GameStats {
  activePlayers: number;
  timePlayed: number; // em horas
  wordsFound: number;
  averageRating: number; // mantém 4.8/5
  lastUpdate?: number; // timestamp da última atualização
}

class StatsService {
  private readonly STORAGE_KEY = 'gsl_game_stats';

  private getInitialStats(): GameStats {
    return {
      activePlayers: 89,
      timePlayed: 234,
      wordsFound: 3456,
      averageRating: 4.8,
    };
  }

  private getStoredStats(): GameStats | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Não foi possível salvar as estatísticas:', error);
    }
  }

  private calculateWeeklyGrowth(stats: GameStats): GameStats {
    const now = new Date();
    const lastUpdate = new Date(stats.lastUpdate || 0);
    const daysSinceUpdate = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysSinceUpdate === 0) {
      return stats;
    }

    // Crescimento diário mais sutil
    const dailyIncrements = {
      activePlayers: 0.7, // ~5 por semana
      timePlayed: 2.5, // ~18 por semana
      wordsFound: 17, // ~120 por semana
    };

    return {
      ...stats,
      activePlayers: Math.floor(
        stats.activePlayers + dailyIncrements.activePlayers * daysSinceUpdate
      ),
      timePlayed: Math.floor(
        stats.timePlayed + dailyIncrements.timePlayed * daysSinceUpdate
      ),
      wordsFound: Math.floor(
        stats.wordsFound + dailyIncrements.wordsFound * daysSinceUpdate
      ),
      averageRating: stats.averageRating, // mantém constante
      lastUpdate: now.getTime(),
    };
  }

  public getStats(): GameStats {
    let stats = this.getStoredStats();

    if (!stats) {
      stats = this.getInitialStats();
      stats.lastUpdate = Date.now();
      this.saveStats(stats);
      return stats;
    }

    // Aplica crescimento semanal
    const updatedStats = this.calculateWeeklyGrowth(stats);

    // Salva apenas se houve mudanças
    if (updatedStats.lastUpdate !== stats.lastUpdate) {
      this.saveStats(updatedStats);
    }

    return updatedStats;
  }

  public formatStats(stats: GameStats) {
    return {
      activePlayers: stats.activePlayers.toLocaleString('pt-BR'),
      timePlayed: `${stats.timePlayed.toLocaleString('pt-BR')}h`,
      wordsFound: stats.wordsFound.toLocaleString('pt-BR'),
      averageRating: `${stats.averageRating}/5`,
    };
  }

  public resetStats(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Função para simular crescimento mais rápido (para demonstração)
  public simulateGrowth(days: number = 7): GameStats {
    const stats = this.getStats();
    const dailyIncrements = {
      activePlayers: 0.7,
      timePlayed: 2.5,
      wordsFound: 17,
    };

    return {
      ...stats,
      activePlayers: Math.floor(
        stats.activePlayers + dailyIncrements.activePlayers * days
      ),
      timePlayed: Math.floor(
        stats.timePlayed + dailyIncrements.timePlayed * days
      ),
      wordsFound: Math.floor(
        stats.wordsFound + dailyIncrements.wordsFound * days
      ),
      averageRating: stats.averageRating,
      lastUpdate: Date.now(),
    };
  }
}

export const statsService = new StatsService();
export type { GameStats };
