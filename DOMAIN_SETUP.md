# 🌐 Configuração de Domínio Personalizado - Caça-Palavras

## 🎯 **Status Atual**
- ✅ Google Analytics configurado (G-BTMV7DMVMT)
- ✅ Domínio comprado
- ✅ Projeto pronto para deploy

## 🚀 **Opção 1: Deploy no GitHub Pages (Recomendado)**

### **1.1 Criar Repositório no GitHub**
1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Configure:
   - **Repository name**: `caca-palavras`
   - **Description**: Jogo educativo de caça-palavras
   - **Visibility**: Public
   - **Não** inicialize com README
4. Clique **"Create repository"**

### **1.2 Conectar Repositório Local**
```bash
# Substitua SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/caca-palavras.git
git branch -M main
git push -u origin main
```

### **1.3 Configurar GitHub Pages**
1. Vá em **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages`
4. **Folder**: `/ (root)`
5. Clique **Save**

### **1.4 Configurar Domínio Personalizado**
1. Em **Settings** > **Pages**
2. **Custom domain**: Digite seu domínio (ex: `cacapalavras.com`)
3. Marque **"Enforce HTTPS"**
4. Clique **Save**

### **1.5 Configurar DNS**
Configure os registros DNS no seu provedor de domínio:

#### **Para domínio raiz (ex: cacapalavras.com):**
```
Tipo: A
Nome: @
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.111.153
TTL: 3600
```

#### **Para www (ex: www.cacapalavras.com):**
```
Tipo: CNAME
Nome: www
Valor: SEU_USUARIO.github.io
TTL: 3600
```

## 🎯 **Opção 2: Deploy no Vercel (Alternativa)**

### **2.1 Conectar ao Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **2.2 Configurar Domínio no Vercel**
1. Vá em **Settings** > **Domains**
2. Clique **"Add Domain"**
3. Digite seu domínio
4. Configure os registros DNS conforme instruções do Vercel

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
   - **Website URL**: `https://seu-dominio.com`
   - **Stream name**: Caça-Palavras Production
5. Clique **"Create stream"**

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
- ✅ **HTTPS** funcionando
- ✅ **Analytics** rastreando dados
- ✅ **PWA** instalável
- ✅ **Deploy automático** configurado

**URLs finais:**
- **Site principal**: `https://seu-dominio.com`
- **Analytics**: `https://analytics.google.com`
- **GitHub**: `https://github.com/SEU_USUARIO/caca-palavras`

---

## 🆘 **Precisa de Ajuda?**

Se encontrar problemas:
1. **Verifique os logs** do GitHub Actions
2. **Teste o DNS** com ferramentas online
3. **Consulte a documentação** do seu provedor de DNS
4. **Entre em contato** com o suporte do provedor

**Seu jogo estará online e pronto para receber usuários!** 🚀
