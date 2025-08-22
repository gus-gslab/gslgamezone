import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSEOConfig, generateHreflangTags } from '../utils/languageDetection';

interface SEOHeadProps {
  pageTitle?: string;
  pageDescription?: string;
  pageKeywords?: string;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  pageTitle,
  pageDescription,
  pageKeywords,
  canonicalUrl
}) => {
  const { i18n } = useTranslation();
  const seoConfig = getSEOConfig(i18n.language);

  useEffect(() => {
    // Atualizar título da página
    const title = pageTitle || seoConfig.title;
    document.title = title;

    // Atualizar meta description
    const description = pageDescription || seoConfig.description;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Atualizar meta keywords
    const keywords = pageKeywords || seoConfig.keywords;
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Atualizar canonical URL
    const canonical = canonicalUrl || seoConfig.fullUrl;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Atualizar Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonical);

    // Atualizar Twitter Card
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);

    // Atualizar hreflang
    const hreflangTags = generateHreflangTags();
    let hreflangContainer = document.getElementById('hreflang-container');
    if (!hreflangContainer) {
      hreflangContainer = document.createElement('div');
      hreflangContainer.id = 'hreflang-container';
      hreflangContainer.style.display = 'none';
      document.head.appendChild(hreflangContainer);
    }
    hreflangContainer.innerHTML = hreflangTags;

  }, [i18n.language, pageTitle, pageDescription, pageKeywords, canonicalUrl, seoConfig]);

  return null; // Este componente não renderiza nada visualmente
};

export default SEOHead;
