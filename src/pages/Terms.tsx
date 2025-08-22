import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const Terms: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Remover o useEffect que força a detecção de idioma
  // O i18n já detecta automaticamente e reage às mudanças

  const handleBackToHome = () => {
    navigate('/');
  };

  const termsContent = {
    pt: {
      title: "Termos de Uso",
      lastUpdated: "Última atualização: Janeiro 2024",
      sections: [
        {
          title: "1. Aceitação dos Termos",
          content: "Ao acessar e usar o GSL Game Zone, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços."
        },
        {
          title: "2. Descrição do Serviço",
          content: "O GSL Game Zone oferece jogos educativos online gratuitos, incluindo caça-palavras e outros jogos interativos. Nossos serviços são destinados a fins educacionais e de entretenimento."
        },
        {
          title: "3. Uso Aceitável",
          content: "Você concorda em usar nossos serviços apenas para fins legais e de acordo com estes Termos. É proibido usar nossos serviços para qualquer atividade ilegal, prejudicial ou que viole os direitos de terceiros."
        },
        {
          title: "4. Propriedade Intelectual",
          content: "Todo o conteúdo do GSL Game Zone, incluindo jogos, textos, gráficos, logotipos e software, é propriedade da GSL Game Zone ou de nossos licenciadores e está protegido por leis de direitos autorais."
        },
        {
          title: "5. Privacidade",
          content: "Sua privacidade é importante para nós. Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais."
        },
        {
          title: "6. Limitação de Responsabilidade",
          content: "O GSL Game Zone não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso de nossos serviços."
        },
        {
          title: "7. Modificações",
          content: "Reservamo-nos o direito de modificar estes Termos a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação no site."
        },
        {
          title: "8. Contato",
          content: "Se você tiver dúvidas sobre estes Termos, entre em contato conosco em gslgamezone@gmail.com."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: January 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing and using GSL Game Zone, you agree to comply with and be bound by these Terms of Service. If you do not agree to any part of these terms, you should not use our services."
        },
        {
          title: "2. Service Description",
          content: "GSL Game Zone offers free online educational games, including word search and other interactive games. Our services are intended for educational and entertainment purposes."
        },
        {
          title: "3. Acceptable Use",
          content: "You agree to use our services only for lawful purposes and in accordance with these Terms. It is prohibited to use our services for any illegal, harmful activity or that violates third-party rights."
        },
        {
          title: "4. Intellectual Property",
          content: "All content on GSL Game Zone, including games, text, graphics, logos, and software, is the property of GSL Game Zone or our licensors and is protected by copyright laws."
        },
        {
          title: "5. Privacy",
          content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information."
        },
        {
          title: "6. Limitation of Liability",
          content: "GSL Game Zone will not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services."
        },
        {
          title: "7. Modifications",
          content: "We reserve the right to modify these Terms at any time. Modifications will take effect immediately upon posting on the website."
        },
        {
          title: "8. Contact",
          content: "If you have questions about these Terms, please contact us at gslgamezone@gmail.com."
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: Enero 2024",
      sections: [
        {
          title: "1. Aceptación de los Términos",
          content: "Al acceder y usar GSL Game Zone, usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con cualquier parte de estos términos, no debe usar nuestros servicios."
        },
        {
          title: "2. Descripción del Servicio",
          content: "GSL Game Zone ofrece juegos educativos online gratuitos, incluyendo sopa de letras y otros juegos interactivos. Nuestros servicios están destinados a fines educativos y de entretenimiento."
        },
        {
          title: "3. Uso Aceptable",
          content: "Usted acepta usar nuestros servicios solo para fines legales y de acuerdo con estos Términos. Está prohibido usar nuestros servicios para cualquier actividad ilegal, perjudicial o que viole los derechos de terceros."
        },
        {
          title: "4. Propiedad Intelectual",
          content: "Todo el contenido de GSL Game Zone, incluyendo juegos, textos, gráficos, logotipos y software, es propiedad de GSL Game Zone o de nuestros licenciantes y está protegido por leyes de derechos de autor."
        },
        {
          title: "5. Privacidad",
          content: "Su privacidad es importante para nosotros. Nuestra Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal."
        },
        {
          title: "6. Limitación de Responsabilidad",
          content: "GSL Game Zone no será responsable por cualquier daño directo, indirecto, incidental o consecuente que surja del uso de nuestros servicios."
        },
        {
          title: "7. Modificaciones",
          content: "Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web."
        },
        {
          title: "8. Contacto",
          content: "Si tiene preguntas sobre estos Términos, contáctenos en gslgamezone@gmail.com."
        }
      ]
    }
  };

  const content = termsContent[i18n.language as keyof typeof termsContent] || termsContent.en;

  return (
    <>
      <SEOHead 
        pageTitle={`${content.title} - GSL Game Zone`}
        pageDescription={`${content.title} do GSL Game Zone. Leia nossos termos de uso e condições de serviço.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleBackToHome}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </motion.button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{content.title}</h1>
                    <p className="text-sm text-gray-500">GSL Game Zone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h2>
              <p className="text-gray-600">{content.lastUpdated}</p>
            </div>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                © 2024 GSL Game Zone. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Terms;
