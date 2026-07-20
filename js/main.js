import { applyWhatsAppLinks, buildWhatsAppLink } from "../lib/whatsapp.js";
import { applyPhoneMask, validateLeadForm, clearFieldError } from "../lib/validation.js";
import { initTracking, trackEvent, trackConversion } from "../lib/tracking.js";
import { submitLead } from "../lib/lead-service.js";

initTracking();
applyWhatsAppLinks();

// Eventos de clique: CTA principal e WhatsApp (ver data-track no HTML).
document.querySelectorAll("[data-track]").forEach((el) => {
  el.addEventListener("click", () => trackEvent(el.getAttribute("data-track"), { href: el.getAttribute("href") || "" }));
});

function setupLeadForm(form) {
  const fields = {
    nome: form.querySelector('[name="nome"]'),
    whatsapp: form.querySelector('[name="whatsapp"]'),
    cidade: form.querySelector('[name="cidade"]'),
    criancaNome: form.querySelector('[name="crianca_nome"]'),
    criancaIdade: form.querySelector('[name="crianca_idade"]'),
  };
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBox = form.querySelector("[data-success]");
  const errorBox = form.querySelector("[data-error]");
  let startedTracking = false;

  applyPhoneMask(fields.whatsapp);

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      if (!startedTracking) {
        startedTracking = true;
        trackEvent("form_start", { form_id: form.id });
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true" || submitBtn.disabled) return;

    // Trava o formulário imediatamente, antes de validar, para que dois
    // envios disparados quase ao mesmo tempo nunca passem os dois.
    form.dataset.submitting = "true";
    submitBtn.disabled = true;

    if (!validateLeadForm(fields)) {
      form.dataset.submitting = "false";
      submitBtn.disabled = false;
      const firstInvalid = form.querySelector(".field.has-error input");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.classList.add("is-loading");
    if (errorBox) errorBox.classList.remove("show");
    if (successBox) successBox.classList.remove("show");

    const payload = {
      nome: fields.nome.value.trim(),
      whatsapp: fields.whatsapp.value.trim(),
      cidade: fields.cidade.value.trim(),
      crianca_nome: fields.criancaNome.value.trim(),
      crianca_idade: fields.criancaIdade.value.trim(),
      origem: form.id || "lead-form",
    };

    trackEvent("form_submit", { form_id: form.id });

    submitLead(payload).then((result) => {
      if (!result.ok && !result.skipped && errorBox) {
        errorBox.textContent =
          "Não conseguimos confirmar com o nosso sistema agora, mas siga em frente — vamos continuar por WhatsApp.";
        errorBox.classList.add("show");
      }

      // A conversão só é disparada após a confirmação de envio.
      trackConversion();
      trackEvent("form_submit_success", { form_id: form.id });

      const mensagem =
        "Olá! Gostaria de agendar uma avaliação.\n\n" +
        `Nome: ${payload.nome}\n` +
        `WhatsApp: ${payload.whatsapp}\n` +
        `Cidade: ${payload.cidade}\n` +
        `Nome da criança: ${payload.crianca_nome}\n` +
        `Idade da criança: ${payload.crianca_idade}`;

      window.open(buildWhatsAppLink(mensagem), "_blank", "noopener");

      if (successBox) {
        successBox.textContent = "Perfeito! Vamos continuar no WhatsApp — confira a aba que abrimos para você.";
        successBox.classList.add("show");
      }

      window.setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
        form.dataset.submitting = "false";
      }, 2500);
    });
  });
}

document.querySelectorAll("[data-lead-form]").forEach(setupLeadForm);

// Botões que rolam até o formulário e focam o primeiro campo.
document.querySelectorAll("[data-scroll-focus]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId.charAt(0) !== "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const focusFieldName = link.getAttribute("data-scroll-focus");
    const focusField = focusFieldName ? target.querySelector(`[name="${focusFieldName}"]`) : null;
    window.setTimeout(() => {
      if (focusField) focusField.focus({ preventScroll: true });
    }, 450);
  });
});

// Reveal on scroll (prefers-reduced-motion é tratado via CSS globalmente).
const revealTargets = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
