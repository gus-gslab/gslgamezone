#!/bin/bash

# 🌐 Script de Configuração de Domínio Personalizado - Caça-Palavras

set -e

echo "🌐 Configurando domínio personalizado para Caça-Palavras..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto!"
    exit 1
fi

# Solicitar informações do usuário
echo ""
echo "📝 Informações necessárias para configuração:"
echo ""

read -p "Digite seu username do GitHub: " github_username
read -p "Digite seu domínio (ex: cacapalavras.com): " domain_name
read -p "Qual seu provedor de DNS? (godaddy/namecheap/google/cloudflare/outro): " dns_provider

echo ""
log "Configurando deploy para:"
echo "   GitHub: $github_username"
echo "   Domínio: $domain_name"
echo "   DNS Provider: $dns_provider"
echo ""

# Verificar se o repositório já existe
if git remote get-url origin > /dev/null 2>&1; then
    current_remote=$(git remote get-url origin)
    log "Remote atual: $current_remote"
else
    log "Configurando remote do GitHub..."
    git remote add origin "https://github.com/$github_username/caca-palavras.git"
fi

# Verificar se o analytics está configurado
if grep -q "G-BTMV7DMVMT" public/analytics.js; then
    log "✅ Google Analytics configurado (G-BTMV7DMVMT)"
else
    warn "⚠️  Google Analytics não configurado!"
    echo "📝 Configure o Measurement ID em:"
    echo "   - public/analytics.js"
    echo "   - index.html"
fi

# Build do projeto
log "🔨 Fazendo build do projeto..."
npm run build

if [ ! -d "dist" ]; then
    error "Build falhou! Verifique os erros acima."
    exit 1
fi

log "✅ Build concluído com sucesso!"

# Commit e push
log "💾 Salvando mudanças..."
git add .
git commit -m "Setup: Configuração para domínio $domain_name" || true

log "🚀 Enviando para o GitHub..."
git push origin main || {
    error "Push falhou! Verifique se o repositório existe no GitHub."
    echo "📝 Crie o repositório em: https://github.com/new"
    echo "   Nome: caca-palavras"
    echo "   Público"
    exit 1
}

# Gerar instruções específicas
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo ""

echo "1️⃣  CONFIGURAR GITHUB PAGES:"
echo "   Acesse: https://github.com/$github_username/caca-palavras/settings/pages"
echo "   Source: Deploy from a branch"
echo "   Branch: gh-pages"
echo "   Folder: / (root)"
echo "   Custom domain: $domain_name"
echo "   ✅ Enforce HTTPS"
echo ""

echo "2️⃣  CONFIGURAR DNS ($dns_provider):"
echo ""

case $dns_provider in
    "godaddy")
        echo "   GoDaddy:"
        echo "   1. Acesse My Domains > Manage"
        echo "   2. Clique em DNS"
        echo "   3. Adicione os registros:"
        ;;
    "namecheap")
        echo "   Namecheap:"
        echo "   1. Acesse Domain List > Manage"
        echo "   2. Clique em Advanced DNS"
        echo "   3. Adicione os registros:"
        ;;
    "google")
        echo "   Google Domains:"
        echo "   1. Acesse My Domains > Manage"
        echo "   2. Clique em DNS"
        echo "   3. Adicione os registros:"
        ;;
    "cloudflare")
        echo "   Cloudflare:"
        echo "   1. Acesse DNS > Records"
        echo "   2. Adicione os registros:"
        echo "   3. Configure SSL/TLS para 'Full'"
        ;;
    *)
        echo "   $dns_provider:"
        echo "   1. Acesse o painel de DNS"
        echo "   2. Adicione os registros:"
        ;;
esac

echo ""
echo "   📋 REGISTROS DNS NECESSÁRIOS:"
echo ""
echo "   Para $domain_name (domínio raiz):"
echo "   Tipo: A | Nome: @ | Valor: 185.199.108.153 | TTL: 3600"
echo "   Tipo: A | Nome: @ | Valor: 185.199.109.153 | TTL: 3600"
echo "   Tipo: A | Nome: @ | Valor: 185.199.110.153 | TTL: 3600"
echo "   Tipo: A | Nome: @ | Valor: 185.199.111.153 | TTL: 3600"
echo ""
echo "   Para www.$domain_name:"
echo "   Tipo: CNAME | Nome: www | Valor: $github_username.github.io | TTL: 3600"
echo ""

echo "3️⃣  ATUALIZAR GOOGLE ANALYTICS:"
echo "   Acesse: https://analytics.google.com"
echo "   Admin > Data Streams > Web"
echo "   Website URL: https://$domain_name"
echo "   Stream name: Caça-Palavras Production"
echo ""

echo "4️⃣  VERIFICAR DEPLOY:"
echo "   Aguarde 5-10 minutos para o deploy"
echo "   Teste: https://$domain_name"
echo "   Verifique HTTPS: https://$domain_name"
echo ""

echo "5️⃣  TESTAR ANALYTICS:"
echo "   Acesse o site"
echo "   Jogue algumas palavras"
echo "   Verifique: https://analytics.google.com > Real-time"
echo ""

# Criar arquivo de configuração
cat > domain-config.txt << EOF
# Configuração de Domínio - Caça-Palavras
# Gerado em: $(date)

GitHub Username: $github_username
Domain: $domain_name
DNS Provider: $dns_provider
Analytics ID: G-BTMV7DMVMT

## URLs Finais:
- Site: https://$domain_name
- GitHub: https://github.com/$github_username/caca-palavras
- Analytics: https://analytics.google.com

## DNS Records:
- A @ 185.199.108.153
- A @ 185.199.109.153
- A @ 185.199.110.153
- A @ 185.199.111.153
- CNAME www $github_username.github.io

## Próximos Passos:
1. Configurar GitHub Pages
2. Adicionar registros DNS
3. Atualizar Google Analytics
4. Testar deploy
5. Verificar analytics
EOF

log "✅ Configuração salva em: domain-config.txt"
echo ""
echo "🎉 Configuração concluída!"
echo "📁 Consulte domain-config.txt para referência"
echo ""
echo "🚀 Seu jogo estará online em: https://$domain_name"
