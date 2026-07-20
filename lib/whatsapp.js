import { config } from "../config/site.js";

export function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || config.whatsapp.messageDefault);
  return `https://wa.me/${config.whatsapp.number}?text=${text}`;
}

// Mantém todos os links de WhatsApp da página (botão flutuante, CTAs
// secundários) sincronizados com a config central, sem depender de editar
// vários hrefs espalhados pelo HTML. Os hrefs originais no HTML continuam
// como fallback válido caso o JS não carregue.
export function applyWhatsAppLinks(root = document) {
  root.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    const kind = el.getAttribute("data-whatsapp-link");
    const message = kind === "alt" ? config.whatsapp.messageAlt : config.whatsapp.messageDefault;
    el.setAttribute("href", buildWhatsAppLink(message));
  });
}
