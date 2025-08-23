// Sistema de detecção e redirecionamento de idioma baseado em subdomínio
export const LANGUAGE_CONFIG = {
  'pt': {
    subdomain: 'pt',
    domain: 'gslgamezone.com',
    fullUrl: 'https://pt.gslgamezone.com',
    hreflang: 'pt-BR',
    title: '🎯 GSL Game Zone | Jogos Educativos Online',
    description: 'Jogue Caça-Palavras online grátis! Jogo educativo interativo com múltiplas categorias. Aprenda brincando com palavras em português, inglês e espanhol.',
    keywords: 'caça-palavras, jogo educativo, palavras cruzadas, jogo online, educação, português, inglês, espanhol, gsl game zone'
  },
  'en': {
    subdomain: 'en',
    domain: 'gslgamezone.com',
    fullUrl: 'https://en.gslgamezone.com',
    hreflang: 'en-US',
    title: '🎯 GSL Game Zone | Educational Games Online',
    description: 'Play Word Search online for free! Interactive educational game with multiple categories. Learn while having fun with words in Portuguese, English and Spanish.',
    keywords: 'word search, educational games, crossword puzzles, online games, education, portuguese, english, spanish, gsl game zone'
  },
  'es': {
    subdomain: 'es',
    domain: 'gslgamezone.com',
    fullUrl: 'https://es.gslgamezone.com',
    hreflang: 'es-ES',
    title: '🎯 GSL Game Zone | Juegos Educativos Online',
    description: '¡Juega Sopa de Letras online gratis! Juego educativo interactivo con múltiples categorías. Aprende divirtiéndote con palabras en portugués, inglés y español.',
    keywords: 'sopa de letras, juegos educativos, crucigramas, juegos online, educación, portugués, inglés, español, gsl game zone'
  }
};

// Detectar idioma baseado no subdomínio
export const detectLanguageFromSubdomain = (): string => {
  const hostname = window.location.hostname;
  
  if (hostname.startsWith('pt.')) return 'pt';
  if (hostname.startsWith('en.')) return 'en';
  if (hostname.startsWith('es.')) return 'es';
  
  // Fallback para detecção do navegador
  const browserLang = navigator.language.split('-')[0];
  return ['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'en';
};

// Redirecionar para o subdomínio correto
export const redirectToLanguageSubdomain = (language: string) => {
  const currentHostname = window.location.hostname;
  const targetConfig = LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG];
  
  if (!targetConfig) return;
  
  // Se já está no subdomínio correto, não redirecionar
  if (currentHostname.startsWith(`${targetConfig.subdomain}.`)) return;
  
  // Construir nova URL
  const newUrl = `${targetConfig.fullUrl}${window.location.pathname}${window.location.search}`;
  
  // Redirecionar
  window.location.href = newUrl;
};

// Obter configuração de SEO para o idioma atual
export const getSEOConfig = (language: string) => {
  return LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG] || LANGUAGE_CONFIG.en;
};

// Gerar hreflang tags para todas as versões
export const generateHreflangTags = () => {
  const tags = [];
  
  Object.entries(LANGUAGE_CONFIG).forEach(([, config]) => {
    tags.push(`<link rel="alternate" hreflang="${config.hreflang}" href="${config.fullUrl}" />`);
  });
  
  // Tag x-default
  tags.push(`<link rel="alternate" hreflang="x-default" href="${LANGUAGE_CONFIG.en.fullUrl}" />`);
  
  return tags.join('\n    ');
};
