# SIPH — Landing Page de Agendamento

Site estático (HTML/CSS/JS puro, sem build/bundler) focado em um único objetivo: agendar uma avaliação na SIPH. Sem menu, sem rotas, sem distrações — todo CTA leva ao formulário ou ao WhatsApp.

## Estrutura

```
site/
  index.html          página única
  css/style.css        estilos (paleta, componentes, responsivo)
  config/site.js        configuração central (substitui variáveis de ambiente)
  lib/
    validation.js        validação + máscara de WhatsApp dos formulários
    whatsapp.js           geração/aplicação dos links wa.me
    tracking.js           Meta Pixel / Google Ads (carregados só se configurados)
    lead-service.js       camada de integração com WALeads/Kommo (opcional)
  js/main.js             orquestra tudo (é o único <script type="module"> carregado)
  img/favicon.svg
```

Não há framework porque o projeto original é um site estático simples — a estrutura de `config/` e `lib/` reaproduz, com módulos ES nativos (sem bundler), a separação pedida no briefing (`config/`, `lib/`), adaptada à realidade do projeto.

## Onde trocar as fotos

Cada espaço reservado é um `<div class="photo-placeholder">` com um texto explicando exatamente qual foto entra ali (procure por `[ Espaço para foto ]` no `index.html` — são 7 pontos: hero, identificação, diferenciais, autoridade, chamada final, e o vídeo/foto de depoimento).

Para substituir, troque o `<div class="photo-placeholder ...">...</div>` inteiro por uma tag `<img>`:

```html
<img src="img/crianca-atendimento.jpg" alt="Criança sorrindo durante atendimento na SIPH"
     width="800" height="450" loading="lazy" decoding="async">
```

Na imagem do hero (a única acima da dobra), use `loading="eager" fetchpriority="high"` em vez de `loading="lazy"`, já que é a imagem mais importante da primeira dobra.

## WhatsApp

Número e mensagens ficam centralizados em `config/site.js` (`SIPH_CONFIG.whatsapp`). `lib/whatsapp.js` aplica automaticamente esses valores em todo elemento com `data-whatsapp-link="default"` ou `="alt"`. Os `href` que já estão no HTML são apenas o fallback caso o JS não carregue — sempre edite o `config/site.js`, não os `href` espalhados.

## Integração de leads (WALeads / Kommo)

Fluxo atual: o formulário sempre funciona via WhatsApp (não depende de nenhum backend). Para também mandar o lead para um CRM:

1. Defina `SIPH_CONFIG.leadEndpoint` em `config/site.js` com a URL do seu backend/proxy (não chame a API do provedor direto do navegador — tokens não devem existir no código do site).
2. `lib/lead-service.js` faz um `POST` JSON para esse endpoint a cada envio. Se der erro, o formulário mostra um aviso discreto mas **sempre** segue para o WhatsApp (fallback seguro, a conversão nunca trava).

## Meta Pixel / Google Ads

Preencha os IDs em `config/site.js` → `SIPH_CONFIG.tracking`. Enquanto ficarem `null`, nenhum script de terceiros carrega. `lib/tracking.js` injeta o Pixel/gtag automaticamente quando os IDs existem, e dispara:

- `cta_principal_click`, `whatsapp_click` — clique nos CTAs (via `data-track` no HTML)
- `form_start` — primeiro campo preenchido
- `form_submit` — tentativa de envio validada
- `form_submit_success` + evento de conversão (`Lead` no Pixel / `conversion` no gtag) — só depois da confirmação de envio

## Testando localmente

Como usa ES Modules (`import`/`export`), precisa ser servido por HTTP (não abra o `index.html` direto via `file://`):

```bash
cd site
python -m http.server 8000
# abrir http://localhost:8000
```

## Identidade visual

Paleta e tipografia seguem o `MANUAL - IVA.pdf` (fora do repo, em `Ship/`): cores oficiais como variáveis `--brand-*` no topo de `css/style.css`, fontes Montserrat Alternates (títulos) e Montserrat (texto) carregadas via Google Fonts no `<head>`. O logo real (`img/logo-siph.png`) foi extraído do PDF do manual com o fundo removido — se precisar de uma versão nova (ex.: logo em vetor oficial), é só substituir esse arquivo mantendo a proporção.

## Pendências antes de subir campanha

- Faltam fotos reais em 3 pontos: capa da seção "Chamada final" (criança sorrindo em atividade) e a foto/vídeo de depoimento da seção "Prova social" — os demais 4 placeholders já foram substituídos por fotos reais.
- Substituir o depoimento de exemplo por um real e autorizado (seção "Prova social").
- Preencher `metaPixelId` / `googleAdsId` / `googleConversionLabel` em `config/site.js`.
- Definir `leadEndpoint` se/quando WALeads ou Kommo forem escolhidos.
- Definir a URL final de produção no `<link rel="canonical">` comentado no `<head>` do `index.html`.
