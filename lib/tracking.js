import { config } from "../config/site.js";

// Carrega o Meta Pixel apenas se um ID real for configurado.
function loadMetaPixel(pixelId) {
  /* eslint-disable */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

// Carrega o Google tag (gtag.js) apenas se um ID real for configurado.
function loadGoogleAds(adsId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", adsId);
}

export function initTracking() {
  if (config.tracking.metaPixelId) loadMetaPixel(config.tracking.metaPixelId);
  if (config.tracking.googleAdsId) loadGoogleAds(config.tracking.googleAdsId);
}

// Eventos de interação (não são a conversão em si): clique no CTA
// principal, clique no WhatsApp, início de preenchimento, envio do form.
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window.fbq === "function") window.fbq("trackCustom", eventName, params);
    if (typeof window.gtag === "function") window.gtag("event", eventName, params);
  } catch (e) {
    // rastreamento nunca deve quebrar o fluxo de conversão
  }
}

// Só deve ser chamado após a confirmação de envio do formulário.
export function trackConversion() {
  try {
    if (typeof window.fbq === "function") window.fbq("track", "Lead");
    const { googleAdsId, googleConversionLabel } = config.tracking;
    if (typeof window.gtag === "function" && googleAdsId && googleConversionLabel) {
      window.gtag("event", "conversion", { send_to: `${googleAdsId}/${googleConversionLabel}` });
    }
  } catch (e) {
    // rastreamento nunca deve quebrar o fluxo de conversão
  }
}
