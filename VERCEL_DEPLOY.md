# 🚀 Deploy no Vercel - Home de Jogos Educativos

## 🎯 **Por que Vercel?**

### **Vantagens para Home de Jogos:**
- ✅ **Deploy automático** mais rápido que GitHub Pages
- ✅ **Domínios personalizados** fáceis de configurar
- ✅ **Subdomínios** para cada jogo (ex: jogos.seudominio.com)
- ✅ **Performance superior** com CDN global
- ✅ **Analytics integrado** (Vercel Analytics)
- ✅ **Preview deployments** para testes
- ✅ **Edge Functions** para funcionalidades avançadas

## 📋 **Pré-requisitos**
- ✅ Google Analytics configurado (G-BTMV7DMVMT)
- ✅ Domínio comprado
- ✅ Conta no GitHub
- ✅ Conta no Vercel (gratuita)

## 🚀 **Passo a Passo - Deploy no Vercel**

### **1. Preparar Repositório**
```bash
# Instalar dependências
npm install

# Testar build local
npm run build

# Verificar se tudo funciona
npm run preview
```

### **2. Conectar ao Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. **Import Git Repository**: Conecte com seu GitHub
4. Selecione o repositório `caca-palavras`

### **3. Configurar Projeto**
```json
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **4. Variáveis de Ambiente (Opcional)**
```bash
NODE_ENV=production
VITE_GA_ID=G-BTMV7DMVMT
```

### **5. Deploy**
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. URL temporária: `https://caca-palavras-xxx.vercel.app`

## 🌐 **Configurar Domínio Personalizado**

### **1. Adicionar Domínio**
1. Vá em **Settings** > **Domains**
2. Clique **"Add Domain"**
3. Digite seu domínio: `jogoseducativos.com`
4. Clique **"Add"**

### **2. Configurar DNS**
O Vercel fornecerá instruções específicas. Geralmente:

#### **Para domínio raiz:**
```
Tipo: A
Nome: @
Valor: 76.76.19.36
TTL: 3600
```

#### **Para www:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

### **3. Verificar Configuração**
- Aguarde propagação DNS (5-30 minutos)
- Teste: `https://jogoseducativos.com`
- Teste: `https://www.jogoseducativos.com`

## 📊 **Configurar Analytics**

### **1. Vercel Analytics (Opcional)**
```bash
npm install @vercel/analytics
```

### **2. Atualizar Google Analytics**
1. Acesse [analytics.google.com](https://analytics.google.com)
2. **Admin** > **Data Streams** > **Web**
3. **Website URL**: `https://jogoseducativos.com`
4. **Stream name**: Jogos Educativos Production

### **3. Verificar Tracking**
1. Acesse seu site
2. Abra **Developer Tools** (F12)
3. **Network** > **gtag**
4. Verifique requisições do GA4

## 🎮 **Estrutura de URLs**

### **URLs Principais:**
- **Home**: `https://jogoseducativos.com`
- **Caça-Palavras**: `https://jogoseducativos.com/caca-palavras`
- **Próximos jogos**: `https://jogoseducativos.com/novo-jogo`

### **Subdomínios (Futuro):**
- **Admin**: `https://admin.jogoseducativos.com`
- **API**: `https://api.jogoseducativos.com`
- **Blog**: `https://blog.jogoseducativos.com`

## 🔧 **Configurações Avançadas**

### **1. Otimizações de Performance**
```json
// vercel.json
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

### **2. SEO e Meta Tags**
```html
<!-- index.html -->
<meta name="description" content="Jogos educativos para aprender brincando. Caça-palavras, quebra-cabeça, jogo da memória e muito mais.">
<meta property="og:title" content="Jogos Educativos - Aprenda Brincando">
<meta property="og:description" content="Coleção de jogos educativos para todas as idades">
<meta property="og:image" content="https://jogoseducativos.com/og-image.png">
```

### **3. PWA Configuration**
```json
// manifest.json
{
  "name": "Jogos Educativos",
  "short_name": "JogosEdu",
  "description": "Aprenda brincando com jogos educativos",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6"
}
```

## 📈 **Monitoramento e Analytics**

### **1. Vercel Dashboard**
- **Deployments**: Histórico de deploys
- **Analytics**: Métricas de performance
- **Functions**: Edge functions (se usar)
- **Domains**: Gerenciamento de domínios

### **2. Google Analytics**
- **Real-time**: Usuários ativos
- **Audience**: Demografia e localização
- **Behavior**: Páginas mais visitadas
- **Events**: Eventos do jogo

### **3. Performance Monitoring**
- **Core Web Vitals**: LCP, FID, CLS
- **Lighthouse**: Score de performance
- **PageSpeed Insights**: Análise detalhada

## 🚨 **Troubleshooting**

### **Build Falha**
```bash
# Verificar logs
vercel logs

# Build local
npm run build

# Verificar dependências
npm ci
```

### **Domínio não funciona**
1. Verificar DNS com [whatsmydns.net](https://whatsmydns.net)
2. Aguardar propagação (24-48h)
3. Verificar configuração no Vercel

### **Analytics não funciona**
1. Verificar Measurement ID
2. Testar com Google Tag Assistant
3. Verificar bloqueadores de anúncios

## 🔮 **Próximos Passos**

### **Short Term**
- [ ] Configurar Vercel Analytics
- [ ] Otimizar Core Web Vitals
- [ ] Implementar SEO avançado
- [ ] Criar sitemap.xml

### **Medium Term**
- [ ] Adicionar novos jogos
- [ ] Implementar sistema de usuários
- [ ] Criar dashboard admin
- [ ] Adicionar multiplayer

### **Long Term**
- [ ] API para dados dinâmicos
- [ ] Sistema de conquistas
- [ ] Integração com escolas
- [ ] App mobile

## 🎉 **Resultado Final**

Após seguir este guia, você terá:
- ✅ **Site profissional** com domínio personalizado
- ✅ **Deploy automático** no Vercel
- ✅ **Analytics completo** funcionando
- ✅ **Performance otimizada** com CDN
- ✅ **Estrutura escalável** para novos jogos
- ✅ **PWA** instalável

**URLs finais:**
- **Site**: `https://jogoseducativos.com`
- **Analytics**: `https://analytics.google.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

---

## 🆘 **Suporte**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Google Analytics**: [analytics.google.com](https://analytics.google.com)

**Seu site de jogos educativos estará online e pronto para crescer!** 🚀
