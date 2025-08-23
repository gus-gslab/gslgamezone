import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ThemeToggle } from '../components/ThemeToggle';

const Privacy: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Remover o useEffect que força a detecção de idioma
  // O i18n já detecta automaticamente e reage às mudanças

  const handleBackToHome = () => {
    navigate('/');
  };

  const privacyContent = {
    pt: {
      title: "Política de Privacidade",
      lastUpdated: "Última atualização: Janeiro 2025",
      sections: [
        {
          title: "1. Informações que Coletamos",
          content: "Coletamos informações básicas de uso, incluindo dados de navegação, preferências de idioma e estatísticas de jogo. Não coletamos informações pessoais identificáveis sem seu consentimento explícito."
        },
        {
          title: "2. Como Usamos suas Informações",
          content: "Utilizamos suas informações para melhorar nossos jogos, personalizar sua experiência, analisar o uso do site e fornecer suporte ao cliente. Nunca vendemos ou compartilhamos seus dados pessoais com terceiros."
        },
        {
          title: "3. Cookies e Tecnologias Similares",
          content: "Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o tráfego do site. Você pode desativar cookies em seu navegador a qualquer momento."
        },
        {
          title: "4. Google Analytics",
          content: "Utilizamos o Google Analytics para entender como os usuários interagem com nosso site. O Google Analytics coleta informações anônimas sobre o uso do site, incluindo páginas visitadas e tempo de permanência."
        },
        {
          title: "5. Segurança dos Dados",
          content: "Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição."
        },
        {
          title: "6. Seus Direitos",
          content: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode solicitar uma cópia dos dados que temos sobre você ou retirar seu consentimento a qualquer momento."
        },
        {
          title: "7. Menores de Idade",
          content: "Nossos serviços não são destinados a menores de 13 anos. Não coletamos intencionalmente informações pessoais de menores de 13 anos. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco."
        },
        {
          title: "8. Alterações nesta Política",
          content: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do site ou por email."
        },
        {
          title: "9. Contato",
          content: "Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações, entre em contato conosco em gslgamezone@gmail.com."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 2025",
      sections: [
        {
          title: "1. Information We Collect",
          content: "We collect basic usage information, including browsing data, language preferences, and game statistics. We do not collect personally identifiable information without your explicit consent."
        },
        {
          title: "2. How We Use Your Information",
          content: "We use your information to improve our games, personalize your experience, analyze site usage, and provide customer support. We never sell or share your personal data with third parties."
        },
        {
          title: "3. Cookies and Similar Technologies",
          content: "We use cookies to improve your browsing experience, remember your preferences, and analyze site traffic. You can disable cookies in your browser at any time."
        },
        {
          title: "4. Google Analytics",
          content: "We use Google Analytics to understand how users interact with our website. Google Analytics collects anonymous information about site usage, including pages visited and time spent."
        },
        {
          title: "5. Data Security",
          content: "We implement technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          title: "6. Your Rights",
          content: "You have the right to access, correct, or delete your personal information. You can also request a copy of the data we have about you or withdraw your consent at any time."
        },
        {
          title: "7. Children Under 13",
          content: "Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
        },
        {
          title: "8. Changes to This Policy",
          content: "We may update this Privacy Policy periodically. We will notify you of significant changes through the website or by email."
        },
        {
          title: "9. Contact",
          content: "If you have questions about this Privacy Policy or how we handle your information, please contact us at gslgamezone@gmail.com."
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: Enero 2025",
      sections: [
        {
          title: "1. Información que Recopilamos",
          content: "Recopilamos información básica de uso, incluyendo datos de navegación, preferencias de idioma y estadísticas de juego. No recopilamos información personal identificable sin su consentimiento explícito."
        },
        {
          title: "2. Cómo Usamos su Información",
          content: "Utilizamos su información para mejorar nuestros juegos, personalizar su experiencia, analizar el uso del sitio y proporcionar soporte al cliente. Nunca vendemos o compartimos sus datos personales con terceros."
        },
        {
          title: "3. Cookies y Tecnologías Similares",
          content: "Utilizamos cookies para mejorar su experiencia de navegación, recordar sus preferencias y analizar el tráfico del sitio. Puede desactivar las cookies en su navegador en cualquier momento."
        },
        {
          title: "4. Google Analytics",
          content: "Utilizamos Google Analytics para entender cómo los usuarios interactúan con nuestro sitio web. Google Analytics recopila información anónima sobre el uso del sitio, incluyendo páginas visitadas y tiempo de permanencia."
        },
        {
          title: "5. Seguridad de Datos",
          content: "Implementamos medidas de seguridad técnicas y organizacionales para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción."
        },
        {
          title: "6. Sus Derechos",
          content: "Usted tiene el derecho de acceder, corregir o eliminar su información personal. También puede solicitar una copia de los datos que tenemos sobre usted o retirar su consentimiento en cualquier momento."
        },
        {
          title: "7. Menores de 13 Años",
          content: "Nuestros servicios no están destinados a menores de 13 años. No recopilamos intencionalmente información personal de menores de 13 años. Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, contáctenos."
        },
        {
          title: "8. Cambios en esta Política",
          content: "Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos a través del sitio web o por correo electrónico."
        },
        {
          title: "9. Contacto",
          content: "Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos su información, contáctenos en gslgamezone@gmail.com."
        }
      ]
    }
  };

  const content = privacyContent[i18n.language as keyof typeof privacyContent] || privacyContent.en;

  return (
    <>
      <SEOHead 
        pageTitle={`${content.title} - GSL Game Zone`}
        pageDescription={`${content.title} do GSL Game Zone. Saiba como protegemos e utilizamos suas informações pessoais.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-bg dark:to-dark-bg light-container">
        {/* Efeitos de luz no background */}
        <div className="light-effect-1"></div>
        <div className="light-effect-2"></div>
        <div className="light-effect-3"></div>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-dark-header dark:border-transparent light-content">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleBackToHome}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-dark-border dark:hover:bg-dark-accent dark:text-dark-text"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} className="text-gray-600 dark:text-dark-text" />
                </motion.button>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-600 dark:bg-green-500 rounded-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text">{content.title}</h1>
                    <p className="text-xs text-gray-500 dark:text-dark-textSecondary">GSL Game Zone</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 light-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 dark:border dark:border-dark-border"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">{content.title}</h2>
              <p className="text-gray-600 dark:text-dark-textSecondary">{content.lastUpdated}</p>
            </div>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-dark-border pb-6 last:border-b-0"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-3">{section.title}</h3>
                  <p className="text-gray-700 dark:text-dark-textSecondary leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border text-center">
              <p className="text-sm text-gray-500 dark:text-dark-textSecondary">
                © 2025 GSL Game Zone. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Privacy;
