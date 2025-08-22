# 🚀 Guia Completo de Deploy Gratuito com Google Analytics

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Google Analytics
- ✅ Projeto funcionando localmente

## 🔧 Passo 1: Configurar Google Analytics

### 1.1 Criar Conta no Google Analytics
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Clique em "Começar a medir"
3. Preencha as informações da conta
4. Configure a propriedade:
   - **Nome da propriedade**: Caça-Palavras
   - **Fuso horário**: (UTC-03:00) Brasília
   - **Moeda**: Real brasileiro (BRL)

### 1.2 Configurar Stream de Dados
1. Clique em "Criar stream"
2. Selecione "Web"
3. Configure:
   - **URL do site**: (será preenchida depois)
   - **Nome do stream**: Caça-Palavras Web
4. Clique em "Criar stream"

### 1.3 Obter Measurement ID
1. Copie o **Measurement ID** (formato: G-XXXXXXXXXX)
2. Substitua `GA_MEASUREMENT_ID` no arquivo `public/analytics.js`
3. Substitua `GA_MEASUREMENT_ID` no arquivo `index.html`

## 🌐 Passo 2: Deploy no GitHub Pages (Gratuito)

### 2.1 Preparar Repositório
```bash
# Inicializar git (se ainda não feito)
git init
git add .
git commit -m "Initial commit: Caça-Palavras game"

# Criar repositório no GitHub
# 1. Acesse github.com
# 2. Clique em "New repository"
# 3. Nome: caca-palavras
# 4. Público
# 5. Não inicialize com README
```

### 2.2 Conectar Repositório Local
```bash
git remote add origin https://github.com/SEU_USUARIO/caca-palavras.git
git branch -M main
git push -u origin main
```

### 2.3 Configurar GitHub Actions
O arquivo `.github/workflows/deploy.yml` já está configurado. Ele irá:
- Fazer build do projeto
- Deploy automático no GitHub Pages
- Ativar HTTPS automaticamente

### 2.4 Ativar GitHub Pages
1. Vá em **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: gh-pages
4. **Folder**: / (root)
5. Clique **Save**

## 🎯 Passo 3: Deploy no Vercel (Alternativa Gratuita)

### 3.1 Conectar ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Configurar Domínio
- Vercel fornece domínio gratuito: `caca-palavras.vercel.app`
- Pode conectar domínio personalizado depois

## 📊 Passo 4: Configurar Analytics Avançado

### 4.1 Eventos Personalizados
O jogo já está configurado para rastrear:
- ✅ **Início de jogo**: Categoria, dificuldade, idioma
- ✅ **Palavra encontrada**: Palavra, categoria, dificuldade
- ✅ **Jogo completo**: Tempo, palavras encontradas
- ✅ **Mudanças de configuração**: Antes/depois
- ✅ **Compartilhamento**: Plataforma usada
- ✅ **Visualizações de página**: Navegação

### 4.2 Configurar Goals no GA4
1. Vá em **Configure** > **Events**
2. Clique em **Create Event**
3. Configure eventos importantes:
   - **game_complete**: Jogo completado
   - **game_start**: Jogo iniciado
   - **share**: Compartilhamento

### 4.3 Configurar Relatórios
1. **Engagement** > **Events**: Ver todos os eventos
2. **Engagement** > **Pages and screens**: Páginas mais visitadas
3. **Acquisition** > **Traffic acquisition**: De onde vêm os usuários
4. **Engagement** > **User engagement**: Tempo na página

## 📱 Passo 5: Deploy Mobile (PWA)

### 5.1 Configurar PWA
O `manifest.json` já está configurado. Para instalar:
- **Android**: Chrome > Menu > "Adicionar à tela inicial"
- **iOS**: Safari > Compartilhar > "Adicionar à tela inicial"

### 5.2 Testar PWA
1. Acesse o site no mobile
2. Deve aparecer prompt de instalação
3. Teste funcionalidade offline

## 🔍 Passo 6: Monitoramento e Analytics

### 6.1 Métricas Importantes
- **Usuários ativos**: Quantos jogam por dia/semana/mês
- **Tempo na página**: Engajamento dos usuários
- **Taxa de conclusão**: % que completam o jogo
- **Categorias populares**: Quais mais jogadas
- **Dificuldades preferidas**: Fácil, médio, difícil
- **Idiomas mais usados**: PT, EN, ES

### 6.2 Relatórios Personalizados
1. **Engagement** > **Create custom report**
2. Configure métricas:
   - Eventos de jogo
   - Tempo de sessão
   - Taxa de retorno

### 6.3 Alertas
1. **Configure** > **Alerts**
2. Configure alertas para:
   - Queda brusca de usuários
   - Aumento de erros
   - Picos de tráfego

## 🚀 Passo 7: Otimizações

### 7.1 Performance
- **Lighthouse**: Teste performance regularmente
- **Core Web Vitals**: Monitore LCP, FID, CLS
- **Mobile**: Otimize para dispositivos móveis

### 7.2 SEO
- **Google Search Console**: Conecte o site
- **Sitemap**: Gere automaticamente
- **Meta tags**: Já configuradas

### 7.3 Segurança
- **HTTPS**: Automático no GitHub Pages/Vercel
- **Headers**: Já configurados
- **CSP**: Content Security Policy

## 📈 Passo 8: Análise de Dados

### 8.1 Relatórios Semanais
- **Usuários**: Quantos únicos por semana
- **Sessões**: Quantas sessões por usuário
- **Duração**: Tempo médio por sessão
- **Eventos**: Palavras encontradas, jogos completados

### 8.2 Insights de Produto
- **Categorias mais populares**: Focar no conteúdo
- **Dificuldades preferidas**: Ajustar balanceamento
- **Idiomas**: Expandir se necessário
- **Horários de pico**: Melhorar disponibilidade

### 8.3 A/B Testing
- **Diferentes layouts**: Testar variações
- **Novas categorias**: Medir engajamento
- **Dificuldades**: Otimizar balanceamento

## 🔧 Troubleshooting

### Problemas Comuns
1. **Analytics não funciona**:
   - Verifique Measurement ID
   - Teste com Google Tag Assistant
   - Verifique bloqueadores de anúncios

2. **Deploy falha**:
   - Verifique logs do GitHub Actions
   - Teste build local: `npm run build`
   - Verifique dependências

3. **PWA não instala**:
   - Verifique HTTPS
   - Teste manifest.json
   - Verifique service worker

## 📞 Suporte

- **GitHub Issues**: Para bugs e melhorias
- **Google Analytics Help**: Para dúvidas de analytics
- **Vercel Support**: Para problemas de deploy
- **GitHub Support**: Para problemas de Pages

---

## 🎉 Resultado Final

Após seguir este guia, você terá:
- ✅ Site online gratuitamente
- ✅ Analytics completo funcionando
- ✅ PWA instalável
- ✅ Monitoramento de usuários
- ✅ Relatórios detalhados
- ✅ Performance otimizada

**URLs finais:**
- GitHub Pages: `https://SEU_USUARIO.github.io/caca-palavras`
- Vercel: `https://caca-palavras.vercel.app`

**Analytics disponível em:**
- Google Analytics: `https://analytics.google.com`
