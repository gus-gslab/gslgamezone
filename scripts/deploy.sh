#!/bin/bash

# 🚀 Script de Deploy Automatizado - Caça-Palavras
# Este script automatiza o processo de deploy para GitHub Pages e Vercel

set -e  # Para o script se houver erro

echo "🎯 Iniciando deploy do Caça-Palavras..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# Verificar se o Google Analytics está configurado
if grep -q "GA_MEASUREMENT_ID" public/analytics.js; then
    warn "⚠️  Google Analytics não configurado!"
    echo "📝 Para configurar:"
    echo "   1. Acesse https://analytics.google.com"
    echo "   2. Crie uma propriedade"
    echo "   3. Copie o Measurement ID (G-XXXXXXXXXX)"
    echo "   4. Substitua GA_MEASUREMENT_ID nos arquivos:"
    echo "      - public/analytics.js"
    echo "      - index.html"
    echo ""
    read -p "Deseja continuar sem analytics? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deploy cancelado. Configure o Google Analytics primeiro."
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

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    error "Build falhou! Verifique os erros acima."
    exit 1
fi

log "✅ Build concluído com sucesso!"

# Verificar se git está configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log "🔧 Inicializando repositório Git..."
    git init
    git add .
    git commit -m "Initial commit: Caça-Palavras game"
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

# Commit das mudanças
log "💾 Salvando mudanças..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true

# Push para o GitHub
log "🚀 Enviando para o GitHub..."
git push origin main || {
    warn "⚠️  Push falhou. Verifique se o remote está configurado corretamente."
    echo "📝 Comandos úteis:"
    echo "   git remote -v"
    echo "   git remote add origin https://github.com/SEU_USUARIO/caca-palavras.git"
    echo "   git push -u origin main"
}

log "🎉 Deploy iniciado!"
echo ""
echo "📊 Próximos passos:"
echo "   1. GitHub Pages: https://github.com/SEU_USUARIO/caca-palavras/settings/pages"
echo "   2. Vercel: https://vercel.com/new (importe o repositório)"
echo "   3. Google Analytics: https://analytics.google.com"
echo ""
echo "🔗 URLs finais:"
echo "   - GitHub Pages: https://SEU_USUARIO.github.io/caca-palavras"
echo "   - Vercel: https://caca-palavras.vercel.app"
echo ""
echo "📈 Analytics:"
echo "   - Google Analytics: https://analytics.google.com"
echo "   - GitHub Insights: https://github.com/SEU_USUARIO/caca-palavras/insights"
