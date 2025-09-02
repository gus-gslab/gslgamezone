interface GameStats {
  activePlayers: number;
  timePlayed: number; // em horas
  wordsFound: number;
  averageRating: number; // mantém 4.8/5
  lastUpdate?: number; // timestamp da última atualização
}

class StatsService {
  private readonly STORAGE_KEY = 'gsl_game_stats';
  private readonly WEEKLY_INCREMENTS = {
    activePlayers: 3, // +3 jogadores por semana
    timePlayed: 12, // +12 horas por semana
    wordsFound: 67, // +67 palavras por semana
  };

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
    const weeksSinceUpdate = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    if (weeksSinceUpdate === 0) {
      return stats;
    }

    return {
      ...stats,
      activePlayers:
        stats.activePlayers +
        this.WEEKLY_INCREMENTS.activePlayers * weeksSinceUpdate,
      timePlayed:
        stats.timePlayed + this.WEEKLY_INCREMENTS.timePlayed * weeksSinceUpdate,
      wordsFound:
        stats.wordsFound + this.WEEKLY_INCREMENTS.wordsFound * weeksSinceUpdate,
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
}

export const statsService = new StatsService();
export type { GameStats };
