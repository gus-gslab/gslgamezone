#!/bin/bash

# 🚀 Script de Deploy no Vercel - Home de Jogos Educativos

set -e

echo "🚀 Preparando deploy no Vercel para Home de Jogos Educativos..."

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
echo "📝 Informações para deploy no Vercel:"
echo ""

read -p "Digite seu domínio (ex: jogoseducativos.com): " domain_name
read -p "Digite seu email do Vercel: " vercel_email

echo ""
log "Configurando deploy para:"
echo "   Domínio: $domain_name"
echo "   Email: $vercel_email"
echo ""

# Verificar se o analytics está configurado
if grep -q "G-BTMV7DMVMT" public/analytics.js; then
    log "✅ Google Analytics configurado (G-BTMV7DMVMT)"
else
    warn "⚠️  Google Analytics não configurado!"
    echo "📝 Configure o Measurement ID em:"
    echo "   - public/analytics.js"
    echo "   - index.html"
fi

# Verificar se o git está configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log "🔧 Inicializando repositório Git..."
    git init
    git add .
    git commit -m "Initial commit: Home de Jogos Educativos"
fi

# Verificar se o remote está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    warn "⚠️  Remote 'origin' não configurado!"
    echo "📝 Para configurar:"
    echo "   1. Crie um repositório no GitHub"
    echo "   2. Execute: git remote add origin https://github.com/SEU_USUARIO/caca-palavras.git"
    echo ""
    read -p "Deseja continuar sem remote? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deploy cancelado. Configure o remote primeiro."
        exit 1
    fi
fi

# Instalar dependências
log "📦 Instalando dependências..."
npm ci

# Executar testes
log "🧪 Executando testes..."
npm run lint
npm run type-check

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
git commit -m "Deploy: Home de Jogos Educativos - $(date '+%Y-%m-%d %H:%M:%S')" || true

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
echo "🎯 PRÓXIMOS PASSOS PARA VERCEL:"
echo ""

echo "1️⃣  CONECTAR AO VERCEL:"
echo "   Acesse: https://vercel.com"
echo "   Clique em 'New Project'"
echo "   Import Git Repository"
echo "   Selecione: caca-palavras"
echo ""

echo "2️⃣  CONFIGURAR PROJETO:"
echo "   Framework Preset: Vite"
echo "   Root Directory: ./"
echo "   Build Command: npm run build"
echo "   Output Directory: dist"
echo "   Install Command: npm install"
echo ""

echo "3️⃣  CONFIGURAR DOMÍNIO:"
echo "   Settings > Domains"
echo "   Add Domain: $domain_name"
echo "   Configure DNS conforme instruções do Vercel"
echo ""

echo "4️⃣  CONFIGURAR DNS:"
echo "   O Vercel fornecerá instruções específicas"
echo "   Geralmente:"
echo "   - A @ 76.76.19.36"
echo "   - CNAME www cname.vercel-dns.com"
echo ""

echo "5️⃣  ATUALIZAR GOOGLE ANALYTICS:"
echo "   Acesse: https://analytics.google.com"
echo "   Admin > Data Streams > Web"
echo "   Website URL: https://$domain_name"
echo "   Stream name: Jogos Educativos Production"
echo ""

echo "6️⃣  VERIFICAR DEPLOY:"
echo "   Aguarde 2-3 minutos para o deploy"
echo "   Teste: https://$domain_name"
echo "   Teste: https://$domain_name/caca-palavras"
echo ""

# Criar arquivo de configuração
cat > vercel-config.txt << EOF
# Configuração Vercel - Home de Jogos Educativos
# Gerado em: $(date)

Domain: $domain_name
Email: $vercel_email
Analytics ID: G-BTMV7DMVMT

## URLs Finais:
- Home: https://$domain_name
- Caça-Palavras: https://$domain_name/caca-palavras
- Analytics: https://analytics.google.com
- Vercel Dashboard: https://vercel.com/dashboard

## DNS Records (Vercel fornecerá):
- A @ 76.76.19.36
- CNAME www cname.vercel-dns.com

## Próximos Passos:
1. Conectar ao Vercel
2. Configurar projeto
3. Adicionar domínio
4. Configurar DNS
5. Atualizar Google Analytics
6. Testar deploy

## Vantagens do Vercel:
- Deploy automático mais rápido
- Performance superior com CDN
- Analytics integrado
- Subdomínios fáceis
- Preview deployments
EOF

log "✅ Configuração salva em: vercel-config.txt"
echo ""
echo "🎉 Preparação concluída!"
echo "📁 Consulte vercel-config.txt para referência"
echo ""
echo "🚀 Próximo passo: Conectar ao Vercel"
echo "   Acesse: https://vercel.com/new"
echo ""
echo "🌐 Seu site estará online em: https://$domain_name"
