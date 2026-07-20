// Validação e máscara dos formulários de lead. Mensagens em pt-BR,
// sem bloquear a digitação — só sinaliza erro na tentativa de envio.

export function onlyDigits(value) {
  return (value || "").replace(/\D/g, "");
}

export function applyPhoneMask(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    const digits = onlyDigits(input.value).slice(0, 11);
    let formatted = digits;

    if (digits.length > 10) {
      formatted = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, ddd, p1, p2) =>
        p2 ? `(${ddd}) ${p1}-${p2}` : `(${ddd}) ${p1}`
      );
    } else if (digits.length > 6) {
      formatted = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, ddd, p1, p2) =>
        p2 ? `(${ddd}) ${p1}-${p2}` : `(${ddd}) ${p1}`
      );
    } else if (digits.length > 2) {
      formatted = digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }

    input.value = formatted;
  });
}

export function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  wrapper.classList.add("has-error");
  field.setAttribute("aria-invalid", "true");

  let errorEl = wrapper.querySelector(".field-error");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.className = "field-error";
    errorEl.id = `${field.id}-error`;
    wrapper.appendChild(errorEl);
  }
  errorEl.textContent = message;
  field.setAttribute("aria-describedby", errorEl.id);
}

export function clearFieldError(field) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  wrapper.classList.remove("has-error");
  field.removeAttribute("aria-invalid");
  const errorEl = wrapper.querySelector(".field-error");
  if (errorEl) errorEl.textContent = "";
}

export function validateLeadForm(fields) {
  let valid = true;

  if (fields.nome.value.trim().length < 3) {
    setFieldError(fields.nome, "Informe seu nome completo.");
    valid = false;
  } else {
    clearFieldError(fields.nome);
  }

  const phoneDigits = onlyDigits(fields.whatsapp.value);
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    setFieldError(fields.whatsapp, "Informe um WhatsApp válido, com DDD.");
    valid = false;
  } else {
    clearFieldError(fields.whatsapp);
  }

  if (fields.cidade.value.trim().length < 2) {
    setFieldError(fields.cidade, "Informe sua cidade.");
    valid = false;
  } else {
    clearFieldError(fields.cidade);
  }

  if (fields.criancaNome.value.trim().length < 2) {
    setFieldError(fields.criancaNome, "Informe o nome da criança.");
    valid = false;
  } else {
    clearFieldError(fields.criancaNome);
  }

  if (fields.criancaIdade.value.trim().length < 1) {
    setFieldError(fields.criancaIdade, "Informe a idade da criança.");
    valid = false;
  } else {
    clearFieldError(fields.criancaIdade);
  }

  return valid;
}
