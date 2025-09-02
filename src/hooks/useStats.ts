import { useState, useEffect } from 'react';
import { statsService, type GameStats } from '../services/statsService';

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(statsService.getStats());
  const [formattedStats, setFormattedStats] = useState(
    statsService.formatStats(stats)
  );

  useEffect(() => {
    // Atualiza as estatísticas a cada hora para simular crescimento em tempo real
    const interval = setInterval(() => {
      const updatedStats = statsService.getStats();
      setStats(updatedStats);
      setFormattedStats(statsService.formatStats(updatedStats));
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, []);

  const resetStats = () => {
    statsService.resetStats();
    const initialStats = statsService.getStats();
    setStats(initialStats);
    setFormattedStats(statsService.formatStats(initialStats));
  };

  return {
    stats,
    formattedStats,
    resetStats,
  };
};
