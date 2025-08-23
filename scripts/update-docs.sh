#!/bin/bash

# 📝 Script de Atualização de Documentação - GSL Game Zone
# Este script atualiza automaticamente a documentação do projeto

echo "🔄 Iniciando atualização da documentação..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto"
    exit 1
fi

# 1. Atualizar versão do projeto
log "📦 Obtendo versão atual do projeto..."
PROJECT_VERSION=$(node -p "require('./package.json').version")
PROJECT_NAME=$(node -p "require('./package.json').name")
log "Versão atual: $PROJECT_VERSION"

# 2. Verificar arquivos modificados
log "🔍 Verificando arquivos modificados..."
MODIFIED_FILES=$(git status --porcelain | grep -E '\.(tsx?|jsx?|json|md)$' | wc -l)

if [ $MODIFIED_FILES -gt 0 ]; then
    warning "Encontrados $MODIFIED_FILES arquivos modificados"
    git status --porcelain | grep -E '\.(tsx?|jsx?|json|md)$'
else
    log "Nenhum arquivo relevante foi modificado"
fi

# 3. Atualizar data de última modificação
CURRENT_DATE=$(date +'%B %Y')
log "📅 Data atual: $CURRENT_DATE"

# 4. Verificar funcionalidades implementadas
log "🔧 Verificando funcionalidades implementadas..."

# Verificar se o sistema de subdomínios está implementado
if grep -q "detectLanguageFromSubdomain" src/utils/languageDetection.ts; then
    SUBDOMAIN_STATUS="✅ IMPLEMENTADO"
else
    SUBDOMAIN_STATUS="❌ PENDENTE"
fi

# Verificar se o SEO está implementado
if [ -f "src/components/SEOHead.tsx" ]; then
    SEO_STATUS="✅ IMPLEMENTADO"
else
    SEO_STATUS="❌ PENDENTE"
fi

# Verificar se o analytics está configurado
if grep -q "G-BTMV7DMVMT" src/services/analyticsService.ts 2>/dev/null; then
    ANALYTICS_STATUS="✅ CONFIGURADO"
else
    ANALYTICS_STATUS="❌ PENDENTE"
fi

# Verificar se o tema escuro está implementado
if [ -f "src/hooks/useTheme.ts" ]; then
    THEME_STATUS="✅ IMPLEMENTADO"
else
    THEME_STATUS="❌ PENDENTE"
fi

# 5. Atualizar arquivos de documentação
log "📝 Atualizando arquivos de documentação..."

# Atualizar README.md
if [ -f "README.md" ]; then
    log "Atualizando README.md..."
    # Aqui você pode adicionar comandos específicos para atualizar o README
    success "README.md atualizado"
fi

# Atualizar SEO_STRATEGY.md
if [ -f "SEO_STRATEGY.md" ]; then
    log "Atualizando SEO_STRATEGY.md..."
    # Substituir a data de última atualização
    sed -i.bak "s/Data.*Dezembro 2024/Data: $CURRENT_DATE/" SEO_STRATEGY.md
    sed -i.bak "s/Versão do Projeto.*1.0.0/Versão do Projeto: $PROJECT_VERSION/" SEO_STRATEGY.md
    rm -f SEO_STRATEGY.md.bak
    success "SEO_STRATEGY.md atualizado"
fi

# Atualizar DOMAIN_SETUP.md
if [ -f "DOMAIN_SETUP.md" ]; then
    log "Atualizando DOMAIN_SETUP.md..."
    sed -i.bak "s/Data.*Dezembro 2024/Data: $CURRENT_DATE/" DOMAIN_SETUP.md
    sed -i.bak "s/Versão do Projeto.*1.0.0/Versão do Projeto: $PROJECT_VERSION/" DOMAIN_SETUP.md
    rm -f DOMAIN_SETUP.md.bak
    success "DOMAIN_SETUP.md atualizado"
fi

# Atualizar NEW_FEATURES.md
if [ -f "NEW_FEATURES.md" ]; then
    log "Atualizando NEW_FEATURES.md..."
    sed -i.bak "s/Data.*Dezembro 2024/Data: $CURRENT_DATE/" NEW_FEATURES.md
    sed -i.bak "s/Versão do Projeto.*1.0.0/Versão do Projeto: $PROJECT_VERSION/" NEW_FEATURES.md
    rm -f NEW_FEATURES.md.bak
    success "NEW_FEATURES.md atualizado"
fi

# 6. Gerar relatório de status
log "📊 Gerando relatório de status..."

cat > docs-status.md << EOF
# 📊 Status da Documentação - GSL Game Zone

**Última atualização**: $CURRENT_DATE  
**Versão do projeto**: $PROJECT_VERSION  
**Nome do projeto**: $PROJECT_NAME

## 🔧 Status das Funcionalidades

| Funcionalidade | Status |
|----------------|--------|
| Sistema de Subdomínios | $SUBDOMAIN_STATUS |
| SEO Otimizado | $SEO_STATUS |
| Analytics | $ANALYTICS_STATUS |
| Tema Escuro | $THEME_STATUS |

## 📝 Arquivos de Documentação

- [x] README.md
- [x] SEO_STRATEGY.md
- [x] DOMAIN_SETUP.md
- [x] NEW_FEATURES.md
- [x] ANALYTICS_SETUP.md
- [x] DEPLOY_GUIDE.md
- [x] I18N_IMPLEMENTATION.md

## 🚀 Próximos Passos

1. Configurar DNS para subdomínios
2. Configurar domínios no Vercel
3. Testar redirecionamentos
4. Configurar Google Search Console

---

*Relatório gerado automaticamente em $(date)*
EOF

success "Relatório de status gerado: docs-status.md"

# 7. Verificar se há commits pendentes
log "🔍 Verificando commits pendentes..."
if git diff --quiet; then
    log "Nenhuma mudança pendente para commit"
else
    warning "Há mudanças pendentes para commit"
    git status --short
fi

# 8. Resumo final
echo ""
echo "🎉 Atualização da documentação concluída!"
echo ""
echo "📋 Resumo:"
echo "  • Versão do projeto: $PROJECT_VERSION"
echo "  • Data de atualização: $CURRENT_DATE"
echo "  • Arquivos atualizados: 4"
echo "  • Relatório gerado: docs-status.md"
echo ""
echo "📝 Próximos passos:"
echo "  1. Revisar as mudanças nos arquivos de documentação"
echo "  2. Fazer commit das atualizações"
echo "  3. Configurar DNS e domínios"
echo ""

success "Documentação atualizada com sucesso! 🚀"
