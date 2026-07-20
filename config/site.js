// Configuração central da landing page da SIPH.
// Substitui "variáveis de ambiente" num site estático sem etapa de build:
// se o projeto migrar futuramente para Next/Vite, estes campos mapeiam
// diretamente para NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GOOGLE_ADS_ID etc.

export const config = {
  whatsapp: {
    // Formato internacional, sem símbolos: 55 + DDD + número.
    number: "5545920016911", // (45) 92001-6911
    messageDefault: "Olá! Gostaria de saber mais sobre a avaliação na SIPH.",
    messageAlt: "Olá! Prefiro conversar primeiro sobre uma avaliação para meu filho(a).",
  },

  contact: {
    phoneDisplay: "(45) 92001-6911",
    address: "R. Riachuelo, 1957, Centro, Cascavel, PR, CEP 85812-110",
  },

  // Integração de leads (WALeads / Kommo). Enquanto a plataforma não estiver
  // definida, mantenha `null`: o formulário continua funcionando 100% via
  // WhatsApp, sem depender de nenhum backend.
  // Quando a plataforma for escolhida, preencha a URL do endpoint (um
  // backend/proxy seu, nunca a API do provedor direto do navegador — não
  // exponha tokens/API keys aqui, eles não pertencem ao código do site).
  leadEndpoint: null,

  // IDs de rastreamento de conversão. Enquanto ficarem `null`, nenhum script
  // de terceiros (Meta Pixel / Google tag) é carregado — sem IDs fictícios.
  tracking: {
    metaPixelId: null, // ex.: "1234567890123456"
    googleAdsId: null, // ex.: "AW-XXXXXXXXX"
    googleConversionLabel: null, // ex.: "XXXXXXXXXXX"
  },
};
