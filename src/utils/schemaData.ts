// Schema.org structured data utilities for better Google indexing

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  sameAs: string[];
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface GameSchema {
  "@context": "https://schema.org";
  "@type": "VideoGame";
  name: string;
  description: string;
  genre: string[];
  gamePlatform: string[];
  applicationCategory: string;
  operatingSystem: string[];
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export const generateOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GSL Game Zone",
  url: "https://gslgamezone.com",
  logo: "https://gslgamezone.com/logo-gslgamezone-darkBG.svg",
  description: "Plataforma de jogos educativos interativos para todas as idades. Jogos de caça-palavras, quebra-cabeças e muito mais em português, inglês e espanhol.",
  email: "gslgamezone@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US"
  },
  sameAs: [
    "https://github.com/gus-gslab/gslgamezone"
  ]
});

export const generateWebSiteSchema = (): WebSiteSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GSL Game Zone",
  url: "https://gslgamezone.com",
  description: "Jogos educativos interativos para todas as idades. Aprenda brincando com nossos jogos de caça-palavras e quebra-cabeças.",
  inLanguage: ["pt-BR", "en-US", "es-ES"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://gslgamezone.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const generateWordSearchGameSchema = (): GameSchema => ({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Caça-Palavras - GSL Game Zone",
  description: "Jogo interativo de caça-palavras com múltiplas categorias e idiomas. Perfeito para melhorar vocabulário e concentração.",
  genre: ["Educational", "Puzzle", "Word Game"],
  gamePlatform: ["Web Browser", "Mobile Browser"],
  applicationCategory: "EducationalApplication",
  operatingSystem: ["Windows", "macOS", "Linux", "iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 89,
    bestRating: 5,
    worstRating: 1
  },
  author: {
    "@type": "Organization",
    name: "GSL Game Zone",
    url: "https://gslgamezone.com"
  }
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>): BreadcrumbSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GSL Game Zone",
  description: "Desenvolvimento de jogos educativos e aplicações web interativas",
  url: "https://gslgamezone.com",
  telephone: "+1-XXX-XXX-XXXX",
  email: "gslgamezone@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "San Francisco",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94102",
    addressCountry: "US"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.7749,
    longitude: -122.4194
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday", 
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    opens: "09:00",
    closes: "18:00"
  }
});
