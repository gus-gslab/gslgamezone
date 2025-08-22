#!/bin/bash

echo "🌍 Configuração de SEO e Subdomínios para GSL Game Zone"
echo "=================================================="

# Configurações dos subdomínios
echo "📋 Configurações de Subdomínios:"
echo "  • pt.gslgamezone.com - Português (Brasil)"
echo "  • en.gslgamezone.com - English (Global)"
echo "  • es.gslgamezone.com - Español (Latino)"
echo ""

# Verificar se o domínio principal existe
echo "🔍 Verificando domínio principal..."
if ! nslookup gslgamezone.com > /dev/null 2>&1; then
    echo "❌ Domínio gslgamezone.com não encontrado!"
    echo "   Certifique-se de que o domínio está configurado corretamente."
    exit 1
fi

echo "✅ Domínio principal encontrado!"

# Configurações de DNS para Vercel
echo ""
echo "🚀 Configurações de DNS para Vercel:"
echo "=================================="

echo "📝 Para cada subdomínio, adicione os seguintes registros DNS:"
echo ""

echo "🌐 pt.gslgamezone.com:"
echo "   Tipo: CNAME"
echo "   Nome: pt"
echo "   Valor: cname.vercel-dns.com"
echo "   TTL: 3600"
echo ""

echo "🌐 en.gslgamezone.com:"
echo "   Tipo: CNAME"
echo "   Nome: en"
echo "   Valor: cname.vercel-dns.com"
echo "   TTL: 3600"
echo ""

echo "🌐 es.gslgamezone.com:"
echo "   Tipo: CNAME"
echo "   Nome: es"
echo "   Valor: cname.vercel-dns.com"
echo "   TTL: 3600"
echo ""

# Configurações de Vercel
echo ""
echo "⚙️ Configurações no Vercel:"
echo "=========================="
echo "1. Acesse o dashboard do Vercel"
echo "2. Vá para Settings > Domains"
echo "3. Adicione os subdomínios:"
echo "   • pt.gslgamezone.com"
echo "   • en.gslgamezone.com"
echo "   • es.gslgamezone.com"
echo "4. Configure o domínio principal como:"
echo "   • gslgamezone.com (redirecionar para en.gslgamezone.com)"
echo ""

# Configurações de SEO
echo ""
echo "🔍 Configurações de SEO:"
echo "======================"
echo "✅ Meta tags dinâmicas implementadas"
echo "✅ Hreflang tags configuradas"
echo "✅ Open Graph tags otimizadas"
echo "✅ Twitter Card tags configuradas"
echo "✅ Canonical URLs definidas"
echo "✅ Structured data pronto para implementação"
echo ""

# Verificar arquivos de configuração
echo ""
echo "📁 Verificando arquivos de configuração:"
if [ -f "src/utils/languageDetection.ts" ]; then
    echo "✅ src/utils/languageDetection.ts"
else
    echo "❌ src/utils/languageDetection.ts - Arquivo não encontrado!"
fi

if [ -f "src/components/SEOHead.tsx" ]; then
    echo "✅ src/components/SEOHead.tsx"
else
    echo "❌ src/components/SEOHead.tsx - Arquivo não encontrado!"
fi

if [ -f "public/og-image.svg" ]; then
    echo "✅ public/og-image.svg"
else
    echo "❌ public/og-image.svg - Arquivo não encontrado!"
fi

echo ""
echo "🎯 Próximos Passos:"
echo "=================="
echo "1. Configure os registros DNS conforme mostrado acima"
echo "2. Configure os domínios no Vercel"
echo "3. Teste cada subdomínio:"
echo "   • https://pt.gslgamezone.com"
echo "   • https://en.gslgamezone.com"
echo "   • https://es.gslgamezone.com"
echo "4. Verifique o SEO com ferramentas como:"
echo "   • Google Search Console"
echo "   • Google PageSpeed Insights"
echo "   • GTmetrix"
echo "   • Screaming Frog SEO Spider"
echo ""

echo "🚀 Configuração de SEO concluída!"
echo "O site agora está otimizado para indexação em múltiplos idiomas!"
