// Utilitários para compartilhamento de resultados do jogo
// Este arquivo NÃO deve ser modificado para manter a funcionalidade estável

interface GameResult {
  wordsFound: number;
  totalWords: number;
  time: string;
  score: number;
  streak: number;
  difficulty: string;
  category: string;
  language: string;
  gameType?: string;
  gameName?: string;
  moves?: number;
  recycles?: number;
  totalTime?: string;
  accuracy?: number;
}

interface ShareTranslations {
  [key: string]: {
    title: string;
    result: string;
    wordsFound: string;
    time: string;
    score: string;
    points: string;
    streak: string;
    difficulty: string;
    category: string;
    playText: string;
    shareTitle: string;
    copySuccess: string;
    difficulties: {
      easy: string;
      medium: string;
      hard: string;
    };
    categories: {
      animals: string;
      colors: string;
      foods: string;
      technology: string;
      professions: string;
      sports: string;
      music: string;
      nature: string;
    };
  };
}

const SHARE_TRANSLATIONS: ShareTranslations = {
  pt: {
    title: 'GSL Game Zone | Free Educational Games Online for All Ages',
    result: 'Resultado',
    wordsFound: 'palavras encontradas',
    time: 'Tempo',
    score: 'Pontuação',
    points: 'pontos',
    streak: 'Sequência',
    difficulty: 'Dificuldade',
    category: 'Categoria',
    playText: 'Joguei Caça-Palavras no GSL Game Zone!',
    shareTitle: 'Compartilhar Resultado',
    copySuccess: 'Resultado copiado para área de transferência!',
    difficulties: {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
    },
    categories: {
      animals: 'Animais',
      colors: 'Cores',
      foods: 'Comidas',
      technology: 'Tecnologia',
      professions: 'Profissões',
      sports: 'Esportes',
      music: 'Música',
      nature: 'Natureza',
    },
  },
  en: {
    title: 'GSL Game Zone | Free Educational Games Online for All Ages',
    result: 'Result',
    wordsFound: 'words found',
    time: 'Time',
    score: 'Score',
    points: 'points',
    streak: 'Streak',
    difficulty: 'Difficulty',
    category: 'Category',
    playText: 'I played Word Search at GSL Game Zone!',
    shareTitle: 'Share Result',
    copySuccess: 'Result copied to clipboard!',
    difficulties: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    categories: {
      animals: 'Animals',
      colors: 'Colors',
      foods: 'Foods',
      technology: 'Technology',
      professions: 'Professions',
      sports: 'Sports',
      music: 'Music',
      nature: 'Nature',
    },
  },
  es: {
    title: 'GSL Game Zone | Free Educational Games Online for All Ages',
    result: 'Resultado',
    wordsFound: 'palabras encontradas',
    time: 'Tiempo',
    score: 'Puntuación',
    points: 'puntos',
    streak: 'Racha',
    difficulty: 'Dificultad',
    category: 'Categoría',
    playText: '¡Jugué Sopa de Letras en GSL Game Zone!',
    shareTitle: 'Compartir Resultado',
    copySuccess: '¡Resultado copiado al portapapeles!',
    difficulties: {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
    },
    categories: {
      animals: 'Animales',
      colors: 'Colores',
      foods: 'Comidas',
      technology: 'Tecnología',
      professions: 'Profesiones',
      sports: 'Deportes',
      music: 'Música',
      nature: 'Naturaleza',
    },
  },
};

// Função para gerar o texto do resultado
export function generateShareText(gameResult: GameResult): string {
  const t = SHARE_TRANSLATIONS[gameResult.language] || SHARE_TRANSLATIONS.en;
  const gameUrl = 'https://gslgamezone.com';

  const difficultyText =
    t.difficulties[gameResult.difficulty as keyof typeof t.difficulties] ||
    gameResult.difficulty;
  const categoryText =
    t.categories[gameResult.category as keyof typeof t.categories] ||
    gameResult.category;

  const getPlayText = (gameName: string, language: string) => {
    switch (language) {
      case 'pt':
        return `Joguei ${gameName} no GSL Game Zone!`;
      case 'es':
        return `¡Jugué ${gameName} en GSL Game Zone!`;
      default:
        return `I played ${gameName} at GSL Game Zone!`;
    }
  };

  const playText = gameResult.gameName
    ? getPlayText(gameResult.gameName, gameResult.language)
    : t.playText;

  return `🎮 ${playText}

🏆 ${gameResult.score} ${t.points}
⏱️ ${t.time}: ${gameResult.time}
🎲 ${categoryText} (${difficultyText})

🎮 ${gameUrl}`;
}

// Função para criar o modal de compartilhamento
export function createShareModal(
  gameResult: GameResult,
  _onAnalyticsTrack?: (_platform: string) => void
): void {
  // const t = SHARE_TRANSLATIONS[gameResult.language] || SHARE_TRANSLATIONS.en;
  const shareText = generateShareText(gameResult);

  // Remover modal existente se houver
  const existingModal = document.getElementById('share-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Criar modal simples
  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 16px;
      max-width: 420px;
      width: 90%;
      position: relative;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    ">
      <!-- Header com gradiente -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
        position: relative;
      ">
        <!-- Botão de fechar no topo -->
        <button onclick="document.getElementById('share-modal').remove()" style="
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
          ✕
        </button>
        
        <div style="color: white; font-size: 32px; margin-bottom: 8px;">🎉</div>
        <h3 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">${
          SHARE_TRANSLATIONS[gameResult.language]?.shareTitle ||
          SHARE_TRANSLATIONS.en.shareTitle
        }</h3>
        <p style="color: rgba(255, 255, 255, 0.8); margin: 5px 0 0 0; font-size: 14px;">${
          gameResult.language === 'pt'
            ? 'Mostre seu desempenho incrível!'
            : gameResult.language === 'es'
            ? '¡Muestra tu increíble rendimiento!'
            : 'Show your amazing performance!'
        }</p>
      </div>
      
      <!-- Card do resultado -->
      <div style="padding: 24px;">
        <!-- Preview Card -->
        <div style="
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
        ">
          <!-- Logo/Ícone do jogo -->
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
            ">
              <span style="color: white; font-size: 20px;">🎮</span>
            </div>
            <div>
              <div style="font-weight: 600; color: #2d3748; font-size: 16px;">GSL Game Zone</div>
              <div style="color: #718096; font-size: 13px;">${
                SHARE_TRANSLATIONS[gameResult.language]?.title.split(
                  ' - '
                )[0] || SHARE_TRANSLATIONS.en.title.split(' - ')[0]
              }</div>
            </div>
          </div>
          
          <!-- Estatísticas compactas -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <!-- Pontos -->
            <div style="
              background: white;
              padding: 8px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
              <div style="font-size: 20px; color: #f6ad55;">🏆</div>
              <div style="flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: #2d3748; line-height: 1;">${
                  gameResult.score
                }</div>
                <div style="font-size: 9px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.points ||
                  SHARE_TRANSLATIONS.en.points
                }</div>
              </div>
            </div>
            
            <!-- Tempo -->
            <div style="
              background: white;
              padding: 8px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
              <div style="font-size: 20px; color: #68d391;">⏱️</div>
              <div style="flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: #2d3748; line-height: 1;">${
                  gameResult.time
                }</div>
                <div style="font-size: 9px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.time ||
                  SHARE_TRANSLATIONS.en.time
                }</div>
              </div>
            </div>
          </div>
          
          <!-- Info adicional -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Categoria -->
            <div style="
              background: white;
              padding: 8px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
              <div style="font-size: 16px; color: #805ad5;">🎲</div>
              <div style="flex: 1;">
                <div style="font-size: 12px; font-weight: 600; color: #2d3748; line-height: 1;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.categories[
                    gameResult.category as keyof typeof SHARE_TRANSLATIONS.pt.categories
                  ] || gameResult.category
                }</div>
                <div style="font-size: 8px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.category ||
                  SHARE_TRANSLATIONS.en.category
                }</div>
              </div>
            </div>
            
            <!-- Dificuldade -->
            <div style="
              background: white;
              padding: 8px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
              <div style="font-size: 16px; color: #f6e05e;">⭐</div>
              <div style="flex: 1;">
                <div style="font-size: 12px; font-weight: 600; color: #2d3748; line-height: 1;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.difficulties[
                    gameResult.difficulty as keyof typeof SHARE_TRANSLATIONS.pt.difficulties
                  ] || gameResult.difficulty
                }</div>
                <div style="font-size: 8px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px;">${
                  SHARE_TRANSLATIONS[gameResult.language]?.difficulty ||
                  SHARE_TRANSLATIONS.en.difficulty
                }</div>
              </div>
            </div>
          </div>
          
          <!-- URL do jogo -->
          <div style="
            margin-top: 12px;
            text-align: center;
            padding: 8px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 6px;
          ">
            <div style="font-size: 12px; color: #667eea; font-weight: 500;">🎮 gslgamezone.com</div>
          </div>
        </div>
        
        <!-- Botões de compartilhamento -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(
            shareText
          )}', '_blank')" style="
            background: #25D366;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(37, 211, 102, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(37, 211, 102, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(37, 211, 102, 0.2)'">
            WhatsApp
          </button>
          <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}', '_blank')" style="
            background: #000000;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.2)'">
            X
          </button>
          <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=https://gslgamezone.com', '_blank')" style="
            background: #4267B2;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(66, 103, 178, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(66, 103, 178, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(66, 103, 178, 0.2)'">
            Facebook
          </button>
          <button onclick="window.open('sms:?body=${encodeURIComponent(
            shareText
          )}', '_self')" style="
            background: #8B5CF6;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(139, 92, 246, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(139, 92, 246, 0.2)'">
            SMS
          </button>
          <button onclick="window.open('mailto:?subject=${encodeURIComponent(
            SHARE_TRANSLATIONS[gameResult.language]?.title ||
              SHARE_TRANSLATIONS.en.title
          )}&body=${encodeURIComponent(shareText)}', '_blank')" style="
            background: #EA4335;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(234, 67, 53, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(234, 67, 53, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(234, 67, 53, 0.2)'">
            Email
          </button>
                    <button onclick="navigator.clipboard.writeText('https://gslgamezone.com').then(() => alert('${
                      SHARE_TRANSLATIONS[gameResult.language]?.copySuccess ||
                      SHARE_TRANSLATIONS.en.copySuccess
                    }'))" style="
            background: #FF6B35;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(255, 107, 53, 0.2);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(255, 107, 53, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(255, 107, 53, 0.2)'">
            ${
              gameResult.language === 'pt'
                ? 'Copiar URL'
                : gameResult.language === 'es'
                ? 'Copiar URL'
                : 'Copy URL'
            }
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// Função para compartilhamento nativo (Web Share API)
export async function shareNative(
  gameResult: GameResult,
  onAnalyticsTrack?: (platform: string) => void
): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const t = SHARE_TRANSLATIONS[gameResult.language] || SHARE_TRANSLATIONS.en;
    const shareText = generateShareText(gameResult);

    await navigator.share({
      title: t.title,
      text: shareText,
      url: 'https://gslgamezone.com',
    });

    if (onAnalyticsTrack) {
      onAnalyticsTrack('native');
    }

    return true;
  } catch (error) {
    console.log('Compartilhamento nativo cancelado ou falhou:', error);
    return false;
  }
}

// Função principal de compartilhamento
export function shareGameResult(
  gameResult: GameResult,
  _onAnalyticsTrack?: (_platform: string) => void
): void {
  // Mostrar modal diretamente (removendo Web Share API temporariamente)
  createShareModal(gameResult, _onAnalyticsTrack);
}
