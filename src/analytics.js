// Google Analytics Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Debug log
console.log('Google Analytics loaded with ID: G-BTMV7DMVMT');

// Replace GA_MEASUREMENT_ID with your actual Google Analytics Measurement ID
gtag('config', 'G-BTMV7DMVMT', {
  page_title: 'Caça-Palavras - Jogo Educativo',
  page_location: window.location.href,
  custom_map: {
    'custom_parameter_1': 'game_category',
    'custom_parameter_2': 'game_difficulty',
    'custom_parameter_3': 'game_language',
    'custom_parameter_4': 'words_found',
    'custom_parameter_5': 'game_completion_time'
  }
});

// Custom events for game analytics
window.gameAnalytics = {
  // Debug log
  init: () => {
    console.log('Game Analytics initialized');
  },
  // Track game start
  trackGameStart: (category, difficulty, language) => {
    console.log('Analytics: Game start tracked', { category, difficulty, language });
    gtag('event', 'game_start', {
      game_category: category,
      game_difficulty: difficulty,
      game_language: language,
      event_category: 'Game',
      event_label: `${category}_${difficulty}_${language}`
    });
  },

  // Track word found
  trackWordFound: (word, category, difficulty) => {
    gtag('event', 'word_found', {
      word: word,
      game_category: category,
      game_difficulty: difficulty,
      event_category: 'Game',
      event_label: word
    });
  },

  // Track game completion
  trackGameComplete: (category, difficulty, language, wordsFound, completionTime) => {
    gtag('event', 'game_complete', {
      game_category: category,
      game_difficulty: difficulty,
      game_language: language,
      words_found: wordsFound,
      completion_time: completionTime,
      event_category: 'Game',
      event_label: `${category}_${difficulty}_${language}`
    });
  },

  // Track settings change
  trackSettingsChange: (setting, oldValue, newValue) => {
    gtag('event', 'settings_change', {
      setting_name: setting,
      old_value: oldValue,
      new_value: newValue,
      event_category: 'Settings',
      event_label: setting
    });
  },

  // Track share action
  trackShare: (platform) => {
    gtag('event', 'share', {
      share_platform: platform,
      event_category: 'Social',
      event_label: platform
    });
  },

  // Track page view
  trackPageView: (page) => {
    gtag('event', 'page_view', {
      page_title: page,
      event_category: 'Navigation',
      event_label: page
    });
  }
};

// Initialize game analytics
if (window.gameAnalytics && window.gameAnalytics.init) {
  window.gameAnalytics.init();
}
