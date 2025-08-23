#!/usr/bin/env node

/**
 * 🎯 Script para Aplicar Palavras Expandidas - GSL Game Zone
 * Aplica as palavras expandidas ao arquivo WordSearchGame.tsx
 */

import fs from 'fs';
import path from 'path';

// Ler o arquivo de palavras expandidas
const expandedWordsPath = path.join(process.cwd(), 'expanded-words.js');
const gameFilePath = path.join(
  process.cwd(),
  'src/components/WordSearchGame.tsx'
);

console.log('🎯 Aplicando palavras expandidas...\n');

// Verificar se o arquivo de palavras expandidas existe
if (!fs.existsSync(expandedWordsPath)) {
  console.error('❌ Arquivo expanded-words.js não encontrado!');
  console.log('💡 Execute primeiro: node scripts/generate-words.js');
  process.exit(1);
}

// Ler o arquivo de palavras expandidas
const expandedWordsContent = fs.readFileSync(expandedWordsPath, 'utf8');

// Ler o arquivo do jogo
const gameFileContent = fs.readFileSync(gameFilePath, 'utf8');

// Encontrar onde está o WORD_CATALOGS atual
const wordCatalogsStart = gameFileContent.indexOf('const WORD_CATALOGS = {');
if (wordCatalogsStart === -1) {
  console.error('❌ WORD_CATALOGS não encontrado no arquivo do jogo!');
  process.exit(1);
}

// Encontrar o final do WORD_CATALOGS
const wordCatalogsEnd = gameFileContent.indexOf('};', wordCatalogsStart) + 2;

// Extrair o WORD_CATALOGS expandido do arquivo gerado
const expandedStart = expandedWordsContent.indexOf('const WORD_CATALOGS = {');
const expandedEnd = expandedWordsContent.indexOf('};', expandedStart) + 2;
const expandedWordCatalogs = expandedWordsContent.substring(
  expandedStart,
  expandedEnd
);

// Substituir o WORD_CATALOGS no arquivo do jogo
const newGameContent =
  gameFileContent.substring(0, wordCatalogsStart) +
  expandedWordCatalogs +
  gameFileContent.substring(wordCatalogsEnd);

// Fazer backup do arquivo original
const backupPath = gameFilePath + '.backup';
fs.writeFileSync(backupPath, gameFileContent);
console.log('💾 Backup criado:', backupPath);

// Salvar o arquivo atualizado
fs.writeFileSync(gameFilePath, newGameContent);

console.log('✅ Palavras expandidas aplicadas com sucesso!');
console.log('📁 Arquivo atualizado:', gameFilePath);

// Mostrar estatísticas
const stats = {
  pt: { easy: 0, medium: 0, hard: 0 },
  en: { easy: 0, medium: 0, hard: 0 },
  es: { easy: 0, medium: 0, hard: 0 },
};

// Contar palavras por categoria
const categories = [
  'animals',
  'colors',
  'foods',
  'technology',
  'professions',
  'sports',
  'music',
  'nature',
];
['pt', 'en', 'es'].forEach(lang => {
  ['easy', 'medium', 'hard'].forEach(difficulty => {
    categories.forEach(category => {
      const regex = new RegExp(
        `${category}: \\[\\s*'[^']+'(?:,\\s*'[^']+')*\\s*\\]`,
        'g'
      );
      const matches = newGameContent.match(regex);
      if (matches) {
        const words = matches[0].match(/'[^']+'/g);
        stats[lang][difficulty] += words ? words.length : 0;
      }
    });
  });
});

console.log('\n📊 Estatísticas das palavras aplicadas:');
console.log('┌─────────┬─────────┬─────────┬─────────┐');
console.log('│ Idioma  │ Fácil   │ Médio   │ Difícil │');
console.log('├─────────┼─────────┼─────────┼─────────┤');
console.log(
  `│ PT      │ ${stats.pt.easy.toString().padStart(7)} │ ${stats.pt.medium
    .toString()
    .padStart(7)} │ ${stats.pt.hard.toString().padStart(7)} │`
);
console.log(
  `│ EN      │ ${stats.en.easy.toString().padStart(7)} │ ${stats.en.medium
    .toString()
    .padStart(7)} │ ${stats.en.hard.toString().padStart(7)} │`
);
console.log(
  `│ ES      │ ${stats.es.easy.toString().padStart(7)} │ ${stats.es.medium
    .toString()
    .padStart(7)} │ ${stats.es.hard.toString().padStart(7)} │`
);
console.log('└─────────┴─────────┴─────────┴─────────┘');

console.log(
  '\n🎉 Processo concluído! Agora o jogo tem muito mais palavras para escolher!'
);

