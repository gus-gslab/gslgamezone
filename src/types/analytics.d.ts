declare global {
  interface Window {
    dataLayer: any[];
    gameAnalytics: {
      trackGameStart: (category: string, difficulty: string, language: string) => void;
      trackWordFound: (word: string, category: string, difficulty: string) => void;
      trackGameComplete: (category: string, difficulty: string, language: string, wordsFound: number, completionTime: number) => void;
      trackSettingsChange: (setting: string, oldValue: string, newValue: string) => void;
      trackShare: (platform: string) => void;
      trackPageView: (page: string) => void;
    };
  }
}

export {};
