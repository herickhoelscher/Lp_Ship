import { config } from "../config/site.js";

// Camada de serviço para integração com WALeads/Kommo (ou qualquer CRM).
// Fallback seguro: sem endpoint configurado, resolve imediatamente como
// "skipped" e o formulário segue normalmente para o WhatsApp. Com endpoint
// configurado, nunca rejeita a Promise — uma falha de rede não deve travar
// a conversão, só é sinalizada para exibir um aviso discreto ao usuário.
export function submitLead(payload) {
  const endpoint = config.leadEndpoint;
  if (!endpoint) {
    return Promise.resolve({ ok: true, skipped: true });
  }

  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => ({ ok: res.ok, skipped: false }))
    .catch(() => ({ ok: false, skipped: false }));
}
