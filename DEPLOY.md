# 🚀 Guia de Deploy - Caça-Palavras

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de que:

1. ✅ O projeto está funcionando localmente (`npm run dev`)
2. ✅ O build está funcionando (`npm run build`)
3. ✅ Todos os testes passam (`npm run lint` e `npm run type-check`)
4. ✅ Você tem uma conta na plataforma escolhida

## 🌐 Opções de Deploy

### 1. Vercel (Recomendado) ⭐

**Vantagens:**
- Deploy automático
- Performance excelente
- Integração com GitHub
- SSL gratuito
- Domínio personalizado

**Passos:**

1. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

2. **Fazer login**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Configurar domínio personalizado** (opcional):
```bash
vercel domains add seu-dominio.com
```

**Configuração automática via GitHub:**
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### 2. Netlify

**Vantagens:**
- Interface amigável
- Deploy automático
- Formulários integrados
- SSL gratuito

**Passos:**

1. **Via CLI**:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

2. **Via Interface Web**:
- Acesse [netlify.com](https://netlify.com)
- Arraste a pasta `dist` para o site
- Configure o domínio

3. **Via GitHub**:
- Conecte o repositório
- Build command: `npm run build`
- Publish directory: `dist`

### 3. GitHub Pages

**Vantagens:**
- Gratuito
- Integração com GitHub
- Controle total

**Passos:**

1. **Configurar GitHub Actions** (já incluído no projeto):
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Configurar repositório**:
- Vá em Settings > Pages
- Source: Deploy from a branch
- Branch: gh-pages

### 4. Firebase Hosting

**Vantagens:**
- Performance do Google
- Integração com outros serviços Firebase
- SSL automático

**Passos:**

1. **Instalar Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login e inicializar**:
```bash
firebase login
firebase init hosting
```

3. **Configurar firebase.json**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Deploy**:
```bash
firebase deploy
```

### 5. AWS S3 + CloudFront

**Vantagens:**
- Escalabilidade
- Performance global
- Controle total

**Passos:**

1. **Criar bucket S3**:
```bash
aws s3 mb s3://seu-bucket-name
```

2. **Configurar bucket para website**:
```bash
aws s3 website s3://seu-bucket-name --index-document index.html --error-document index.html
```

3. **Upload dos arquivos**:
```bash
aws s3 sync dist/ s3://seu-bucket-name
```

4. **Configurar CloudFront** (opcional, para melhor performance)

## 🔧 Configurações Específicas

### Variáveis de Ambiente

Crie um arquivo `.env.production` para configurações de produção:

```env
VITE_APP_TITLE=Caça-Palavras
VITE_APP_DESCRIPTION=Jogo educativo de caça-palavras
VITE_APP_URL=https://seu-dominio.com
```

### Configuração de PWA

O projeto já inclui:
- `manifest.json` configurado
- Service Worker básico
- Ícones para diferentes tamanhos

### SEO e Meta Tags

O `index.html` já inclui:
- Meta tags para SEO
- Open Graph tags
- Twitter Cards
- Favicon

## 📱 Deploy Mobile

### PWA (Progressive Web App)

O jogo já está configurado como PWA. Para instalar:

1. **Android**: Abrir no Chrome e clicar em "Adicionar à tela inicial"
2. **iOS**: Abrir no Safari e clicar em "Adicionar à tela inicial"

### App Stores

Para publicar nas lojas de apps:

1. **Capacitor** (Recomendado):
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap build
```

2. **PWA Builder**:
- Acesse [pwabuilder.com](https://pwabuilder.com)
- Insira a URL do seu site
- Gere os pacotes para Android e iOS

## 🔍 Monitoramento e Analytics

### Google Analytics

1. **Instalar**:
```bash
npm install gtag
```

2. **Configurar** em `index.html`:
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics

Se usar Vercel:
```bash
npm install @vercel/analytics
```

### Sentry (Monitoramento de Erros)

```bash
npm install @sentry/react
```

## 🚀 Otimizações de Performance

### 1. Build Otimizado

O Vite já otimiza automaticamente:
- Code splitting
- Tree shaking
- Minificação
- Gzip compression

### 2. Imagens

- Use formatos modernos (WebP, AVIF)
- Implemente lazy loading
- Otimize tamanhos

### 3. Cache

Configure headers de cache:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🔒 Segurança

### Headers de Segurança

O projeto já inclui headers básicos. Para mais segurança:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### HTTPS

- Vercel, Netlify e Firebase já fornecem HTTPS automaticamente
- Para outros hosts, configure SSL/TLS

## 📊 Monitoramento Pós-Deploy

### 1. Verificações Básicas

- [ ] Site carrega corretamente
- [ ] Todas as funcionalidades funcionam
- [ ] PWA instala corretamente
- [ ] Performance está boa
- [ ] SEO está configurado

### 2. Ferramentas de Teste

- **Lighthouse**: Teste de performance e PWA
- **PageSpeed Insights**: Análise de velocidade
- **WebPageTest**: Teste detalhado de performance

### 3. Monitoramento Contínuo

- Configure alertas de downtime
- Monitore métricas de performance
- Acompanhe analytics de usuários

## 🆘 Troubleshooting

### Problemas Comuns

1. **Build falha**:
   - Verifique erros de TypeScript
   - Execute `npm run lint` e `npm run type-check`
   - Verifique dependências

2. **PWA não funciona**:
   - Verifique se HTTPS está ativo
   - Confirme se manifest.json está correto
   - Teste em diferentes navegadores

3. **Performance ruim**:
   - Otimize imagens
   - Implemente lazy loading
   - Use CDN para assets

4. **SEO não funciona**:
   - Verifique meta tags
   - Teste com Google Search Console
   - Confirme sitemap

## 📞 Suporte

Para problemas específicos:

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **GitHub**: [github.com/support](https://github.com/support)
- **Firebase**: [firebase.google.com/support](https://firebase.google.com/support)

---

🎉 **Parabéns!** Seu jogo está online e pronto para ser jogado por pessoas do mundo todo!
