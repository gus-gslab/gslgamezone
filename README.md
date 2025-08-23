# 🎯 GSL Game Zone - Jogos Educativos Online

Um jogo de caça-palavras interativo e educativo desenvolvido em React com TypeScript. O jogo oferece uma experiência divertida e educativa para encontrar palavras em diferentes idiomas e categorias, com suporte completo a múltiplos idiomas e SEO otimizado.

## ✨ Características

- 🌍 **Múltiplos Idiomas**: Português, Inglês e Espanhol
- 🏗️ **Subdomínios por Idioma**: pt.gslgamezone.com, en.gslgamezone.com, es.gslgamezone.com
- 📏 **Diferentes Tamanhos**: Grids pequeno, médio e grande
- 🎯 **Níveis de Dificuldade**: Fácil, médio e difícil
- 📚 **Categorias Variadas**: Animais, cores, comidas e tecnologia
- 🔊 **Text-to-Speech**: Funcionalidade para falar as palavras encontradas
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🎨 **Animações**: Interface fluida com Framer Motion
- 🏆 **Sistema de Pontuação**: Contagem de palavras e tempo
- 📤 **Compartilhamento**: Compartilhe seus resultados
- 🎊 **Confetti**: Celebração quando completar o puzzle
- 🔔 **Notificações**: Toast notifications para feedback
- 🔍 **SEO Otimizado**: Meta tags dinâmicas, hreflang, Open Graph
- 📊 **Analytics**: Google Analytics integrado
- 🌙 **Tema Escuro**: Suporte a modo escuro/claro

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações
- **React Confetti** - Efeitos visuais
- **React Router** - Navegação
- **i18next** - Internacionalização
- **React i18next** - Hooks de tradução

## 📦 Instalação

1. **Clone o repositório**:

```bash
git clone https://github.com/seu-usuario/gslgamezone.git
cd gslgamezone
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Execute o projeto**:

```bash
npm run dev
```

4. **Acesse no navegador**:

```
http://localhost:3000
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige problemas do linter
- `npm run type-check` - Verifica tipos TypeScript
- `npm run deploy` - Deploy automático
- `npm run deploy-vercel` - Deploy no Vercel

## 🎮 Como Jogar

1. **Configure o Jogo**:

   - Escolha o idioma (Português, Inglês ou Espanhol)
   - Selecione o tamanho do grid (Pequeno, Médio ou Grande)
   - Escolha a dificuldade das palavras (Fácil, Médio ou Difícil)
   - Selecione uma categoria (Animais, Cores, Comidas ou Tecnologia)

2. **Encontre as Palavras**:

   - Clique e arraste para selecionar letras consecutivas
   - As palavras podem estar em qualquer direção (horizontal, vertical, diagonal)
   - Palavras encontradas ficam destacadas em verde
   - Use o botão de som para ouvir as palavras

3. **Complete o Puzzle**:
   - Encontre todas as palavras da lista
   - Acompanhe seu progresso e tempo
   - Celebre quando completar!

## 🌐 Deploy e Domínios

### URLs de Produção

- **Site Principal**: https://gslgamezone.com
- **Português**: https://pt.gslgamezone.com
- **English**: https://en.gslgamezone.com
- **Español**: https://es.gslgamezone.com

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure os domínios e subdomínios
3. Deploy automático a cada push

### Configuração de DNS

```
pt.gslgamezone.com → cname.vercel-dns.com
en.gslgamezone.com → cname.vercel-dns.com
es.gslgamezone.com → cname.vercel-dns.com
gslgamezone.com → en.gslgamezone.com (301 redirect)
```

## 🔍 SEO e Performance

### Meta Tags Dinâmicas

- Títulos otimizados por idioma
- Descriptions específicas por mercado
- Keywords relevantes por região
- Hreflang tags para evitar conteúdo duplicado

### Analytics

- Google Analytics 4 configurado
- Tracking por subdomínio
- Eventos personalizados
- Relatórios de performance

## 📱 PWA (Progressive Web App)

O jogo é uma PWA completa com:

- Manifest.json configurado
- Ícones para diferentes tamanhos
- Funcionalidade offline
- Instalação na tela inicial

## 🎨 Personalização

### Adicionando Novas Palavras

Edite o arquivo `src/components/WordSearchGame.tsx` e adicione palavras ao objeto `WORD_CATALOGS`:

```typescript
const WORD_CATALOGS = {
  pt: {
    easy: {
      novaCategoria: ['PALAVRA1', 'PALAVRA2', 'PALAVRA3'],
    },
  },
};
```

### Modificando Estilos

Os estilos estão organizados em:

- `src/index.css` - Estilos globais e componentes Tailwind
- `tailwind.config.js` - Configuração do tema

## 🔧 Melhorias Implementadas

- ✅ **Sistema de Subdomínios**: URLs específicas por idioma
- ✅ **SEO Otimizado**: Meta tags dinâmicas e hreflang
- ✅ **Analytics**: Google Analytics 4 integrado
- ✅ **Tema Escuro**: Suporte completo a modo escuro/claro
- ✅ **PWA**: Progressive Web App funcional
- ✅ **Responsividade**: Otimizado para todos os dispositivos
- ✅ **Performance**: Build otimizada com Vite
- ✅ **Acessibilidade**: Suporte a leitores de tela

## 🚀 Melhorias Futuras

- [ ] **Sistema de Pontuação**: Pontos baseados em tempo e dificuldade
- [ ] **Modo Competitivo**: Ranking de jogadores
- [ ] **Mais Categorias**: Profissões, países, esportes
- [ ] **Modo Offline**: Cache de palavras para jogar sem internet
- [ ] **Sons**: Efeitos sonoros para interações
- [ ] **Histórico**: Salvar progresso e estatísticas
- [ ] **Dicas**: Sistema de dicas para palavras difíceis
- [ ] **Modo Infantil**: Interface simplificada para crianças
- [ ] **Exportar/Importar**: Compartilhar puzzles personalizados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Gustavo Girard**

- GitHub: [@gus-gslab](https://github.com/gus-gslab)
- LinkedIn: [Gustavo Girard](https://linkedin.com/in/gustavodgirard)

## 📚 Documentação

- [SEO Strategy](SEO_STRATEGY.md) - Estratégia de SEO
- [Domain Setup](DOMAIN_SETUP.md) - Configuração de domínios
- [Analytics Setup](ANALYTICS_SETUP.md) - Configuração de analytics
- [Deploy Guide](DEPLOY_GUIDE.md) - Guia de deploy
- [New Features](NEW_FEATURES.md) - Novas funcionalidades

## 🙏 Agradecimentos

- Comunidade React
- Tailwind CSS
- Framer Motion
- Todos os contribuidores

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
