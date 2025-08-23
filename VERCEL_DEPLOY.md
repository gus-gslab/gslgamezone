# �� Deploy no Vercel - GSL Game Zone

## 🎯 **Sobre o Projeto**

**GSL Game Zone** é uma plataforma de jogos educativos online, atualmente com:
- 🎮 **Caça-Palavras**: Jogo principal em português, inglês e espanhol
- 🌐 **Multi-idioma**: Detecção automática do idioma do navegador
- 🎨 **Tema escuro/claro**: Toggle de tema integrado
- 📱 **Responsivo**: Funciona em desktop e mobile
- 🔗 **Compartilhamento**: Funcionalidade de compartilhar resultados

## 📋 **Tecnologias Utilizadas**

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animações**: Framer Motion
- **i18n**: react-i18next
- **Deploy**: Vercel
- **Analytics**: Google Analytics (G-BTMV7DMVMT)

## 🚀 **Deploy Atual**

### **URLs de Produção:**
- **Site Principal**: `https://gslgamezone.com`
- **Com www**: `https://www.gslgamezone.com`
- **GitHub**: `https://github.com/gus-gslab/gslgamezone`

### **Configuração Atual:**
- ✅ **Deploy automático** via GitHub → Vercel
- ✅ **GitHub conectado** ao Vercel
- ✅ **Branch principal**: `main`
- ✅ **Build command**: `npm run build`
- ✅ **Output directory**: `dist`
- ✅ **Auto-deploy** em cada push para `main`

## 🔧 **Estrutura do Projeto**

```
caca-palavras/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utilitários
│   ├── locales/       # Traduções (pt, en, es)
│   └── services/      # Serviços (analytics)
├── public/            # Arquivos estáticos
├── vercel.json        # Configuração Vercel
└── package.json       # Dependências
```

## 🌐 **Páginas Disponíveis**

- **Home** (`/`): Página principal com navegação
- **Setup** (`/setup`): Configuração do jogo
- **Game** (`/caca-palavras`): Jogo de caça-palavras
- **Privacy** (`/privacy`): Política de privacidade
- **Terms** (`/terms`): Termos de uso

## 🔄 **Fluxo de Deploy**

### **1. Desenvolvimento Local**
```bash
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

### **2. Deploy via Git (Padrão)**
```bash
git add .                    # Adicionar mudanças
git commit -m "descrição"    # Fazer commit
git push origin main         # Enviar para GitHub
```

### **3. Deploy Automático**
```
Git Push → GitHub → Vercel (Automático) → Production
```

### **4. GitHub Actions (CI)**
- ✅ **Install dependencies**
- ✅ **Run linter**
- ✅ **Type check**
- ✅ **Build test**

## 🎮 **Funcionalidades do Jogo**

### **Caça-Palavras:**
- 🎯 **Múltiplas categorias**: Animais, Cores, Comidas, etc.
- ⏱️ **Modo cronômetro**: Tempo limitado
- 🏆 **Sistema de pontuação**: Baseado em tempo e acertos
- 🌍 **3 idiomas**: Português, Inglês, Espanhol
- 📱 **Touch support**: Funciona em dispositivos móveis
- 🎉 **Compartilhamento**: Modal com redes sociais

### **Compartilhamento:**
- 📱 **WhatsApp, Twitter, Facebook**
- 📧 **Email, SMS**
- 🔗 **Copiar URL**
- 🎨 **Card profissional** com resultados

## 🔧 **Configurações Importantes**

### **vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/((?!manifest\\.json|.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)).*)",
      "destination": "/index.html"
    }
  ]
}
```

### **SEO Configurado:**
- ✅ **Meta tags** dinâmicas por página
- ✅ **Open Graph** para redes sociais
- ✅ **Twitter Cards** para Twitter
- ✅ **Structured Data** (JSON-LD)
- ✅ **Sitemap.xml** e **robots.txt**
- ✅ **PWA** com manifest.json

## 🚨 **Troubleshooting Comum**

### **Build Falha:**
```bash
# Verificar dependências
npm ci

# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar TypeScript
npm run type-check
```

### **Deploy não atualiza:**
1. Verificar se o push foi para `main`
2. Verificar GitHub Actions no GitHub
3. Verificar se o Vercel está conectado ao GitHub
4. Verificar logs no Vercel Dashboard
5. **Importante**: Deploy é sempre via Git, nunca direto no Vercel

### **Idioma não detecta:**
- Verificar `src/i18n.ts`
- Verificar `src/utils/languageDetection.ts`
- Limpar cache do navegador

## 📈 **Analytics**

### **Google Analytics:**
- **ID**: G-BTMV7DMVMT
- **Configurado**: Em `src/services/analyticsService.ts`
- **Eventos**: Jogo iniciado, completado, compartilhado

### **Métricas Importantes:**
- 👥 **Usuários ativos**
- 🎮 **Jogos iniciados/completados**
- 🌍 **Distribuição por idioma**
- 📱 **Dispositivos utilizados**

## 🔮 **Próximas Melhorias**

### **Short Term:**
- [ ] Otimizar performance mobile
- [ ] Adicionar mais categorias de palavras
- [ ] Implementar sistema de conquistas

### **Medium Term:**
- [ ] Adicionar novos jogos
- [ ] Sistema de usuários
- [ ] Leaderboard global

### **Long Term:**
- [ ] API backend
- [ ] Multiplayer
- [ ] App mobile

## 🎉 **Status Atual**

✅ **Site online**: `https://gslgamezone.com`  
✅ **Deploy automático**: Funcionando  
✅ **Multi-idioma**: Português, Inglês, Espanhol  
✅ **Responsivo**: Desktop e mobile  
✅ **SEO otimizado**: Meta tags e structured data  
✅ **Analytics**: Google Analytics configurado  
✅ **PWA**: Manifest e service worker  

---

## 🆘 **Suporte**

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repository**: [github.com/gus-gslab/gslgamezone](https://github.com/gus-gslab/gslgamezone)
- **Google Analytics**: [analytics.google.com](https://analytics.google.com)

**GSL Game Zone está online e funcionando!** 🚀
