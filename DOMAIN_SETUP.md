# 🌐 Configuração de Domínio Personalizado - GSL Game Zone

## 🎯 **Status Atual**

- ✅ Google Analytics configurado (G-BTMV7DMVMT)
- ✅ Domínio comprado (gslgamezone.com)
- ✅ Projeto pronto para deploy
- ✅ Sistema de subdomínios implementado
- ✅ SEO multi-idioma configurado
- ✅ Componente SEOHead implementado

## 🚀 **Opção 1: Deploy no Vercel (Recomendado)**

### **1.1 Conectar ao Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **1.2 Configurar Domínio Principal no Vercel**

1. Vá em **Settings** > **Domains**
2. Clique **"Add Domain"**
3. Digite: `gslgamezone.com`
4. Configure os registros DNS conforme instruções do Vercel

### **1.3 Configurar Subdomínios**

1. Adicione os subdomínios:
   - `pt.gslgamezone.com`
   - `en.gslgamezone.com`
   - `es.gslgamezone.com`
2. Todos apontando para o mesmo projeto Vercel

## 🎯 **Opção 2: Deploy no GitHub Pages (Alternativa)**

### **2.1 Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Configure:
   - **Repository name**: `gslgamezone`
   - **Description**: Educational word search games - GSL Game Zone
   - **Visibility**: Public
   - **Não** inicialize com README
4. Clique **"Create repository"**

### **2.2 Conectar Repositório Local**

```bash
# Substitua SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/gslgamezone.git
git branch -M main
git push -u origin main
```

### **2.3 Configurar GitHub Pages**

1. Vá em **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages`
4. **Folder**: `/ (root)`
5. Clique **Save**

## 🔧 **Configuração de DNS**

### **Registros CNAME para Vercel:**

```
pt.gslgamezone.com → cname.vercel-dns.com
en.gslgamezone.com → cname.vercel-dns.com
es.gslgamezone.com → cname.vercel-dns.com
```

### **Registros A para domínio raiz:**

```
Tipo: A
Nome: @
Valor: 76.76.19.36
TTL: 3600
```

### **Redirecionamento Principal:**

```
gslgamezone.com → en.gslgamezone.com (301 redirect)
```

## 🔧 **Configuração de DNS por Provedor**

### **GoDaddy**

1. Acesse **My Domains** > **Manage**
2. Clique em **DNS**
3. Adicione os registros conforme especificado acima

### **Namecheap**

1. Acesse **Domain List** > **Manage**
2. Clique em **Advanced DNS**
3. Adicione os registros conforme especificado acima

### **Google Domains**

1. Acesse **My Domains** > **Manage**
2. Clique em **DNS**
3. Adicione os registros conforme especificado acima

### **Cloudflare**

1. Acesse **DNS** > **Records**
2. Adicione os registros conforme especificado acima
3. **Importante**: Configure SSL/TLS para "Full" ou "Full (strict)"

## 📊 **Atualizar Google Analytics**

### **Configurar Stream de Dados**

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Vá em **Admin** > **Data Streams**
3. Clique em **"Web"**
4. Configure:
   - **Website URL**: `https://gslgamezone.com`
   - **Stream name**: GSL Game Zone Production
5. Clique **"Create stream"**

### **Configurar Propriedades por Subdomínio**

1. Crie propriedades separadas para:
   - `pt.gslgamezone.com`
   - `en.gslgamezone.com`
   - `es.gslgamezone.com`
2. Configure filtros por subdomínio

### **Verificar Tracking**

1. Acesse seu site
2. Abra **Developer Tools** (F12)
3. Vá em **Network** > **gtag**
4. Verifique se as requisições estão sendo enviadas

## 🔍 **Verificação e Testes**

### **1. Testar Deploy**

```bash
# Build local
npm run build

# Testar localmente
npm run preview
```

### **2. Verificar Analytics**

1. Acesse seu site
2. Jogue algumas palavras
3. Verifique em **Google Analytics** > **Real-time**
4. Deve aparecer atividade em tempo real

### **3. Testar PWA**

1. Acesse no mobile
2. Deve aparecer prompt de instalação
3. Teste funcionalidade offline

### **4. Testar Subdomínios**

1. Acesse `pt.gslgamezone.com`
2. Acesse `en.gslgamezone.com`
3. Acesse `es.gslgamezone.com`
4. Verifique se o idioma muda corretamente

## 🚨 **Problemas Comuns**

### **DNS não propagou**

- Aguarde 24-48 horas
- Use [whatsmydns.net](https://whatsmydns.net) para verificar
- Teste com diferentes ISPs

### **HTTPS não funciona**

- Verifique se "Enforce HTTPS" está marcado
- Aguarde certificado SSL (pode demorar algumas horas)
- Teste em modo incógnito

### **Analytics não funciona**

- Verifique se o domínio está correto no GA4
- Teste com Google Tag Assistant
- Verifique bloqueadores de anúncios

### **Subdomínios não funcionam**

- Verifique configuração DNS
- Aguarde propagação (pode demorar até 48h)
- Teste com ferramentas online

## 📈 **Próximos Passos Após Deploy**

### **1. SEO e Performance**

- Conectar **Google Search Console**
- Configurar **sitemap.xml**
- Otimizar **Core Web Vitals**

### **2. Monitoramento**

- Configurar **alertas** no Google Analytics
- Monitorar **uptime** do site
- Acompanhar **performance** regularmente

### **3. Marketing**

- Compartilhar nas **redes sociais**
- Criar **campanhas** de marketing
- Monitorar **referral traffic**

## 🎉 **Resultado Final**

Após seguir este guia, você terá:

- ✅ **Site online** com domínio personalizado
- ✅ **Subdomínios** funcionando por idioma
- ✅ **HTTPS** funcionando
- ✅ **Analytics** rastreando dados
- ✅ **PWA** instalável
- ✅ **Deploy automático** configurado

**URLs finais:**

- **Site principal**: `https://gslgamezone.com`
- **Português**: `https://pt.gslgamezone.com`
- **English**: `https://en.gslgamezone.com`
- **Español**: `https://es.gslgamezone.com`
- **Analytics**: `https://analytics.google.com`

---

## 🆘 **Precisa de Ajuda?**

Se encontrar problemas:

1. **Verifique os logs** do Vercel/GitHub Actions
2. **Teste o DNS** com ferramentas online
3. **Consulte a documentação** do seu provedor de DNS
4. **Entre em contato** com o suporte do provedor

**Seu jogo estará online e pronto para receber usuários!** 🚀

---

## 📝 **Última Atualização**

- \*\*Data: August 2025
- \*\*Versão do Projeto: 1.0.0
- **Status**: Sistema implementado, aguardando configuração de DNS
