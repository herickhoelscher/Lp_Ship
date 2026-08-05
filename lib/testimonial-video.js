import { trackEvent } from "./tracking.js";

// Vídeo carregado sob demanda: nada de vídeo é baixado até o clique no
// play — troca o botão/capa por um <video> real com controles nativos.
export function setupTestimonialVideos(root = document) {
  root.querySelectorAll("[data-video-trigger]").forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        const card = btn.closest(".testimonial-video-poster");
        const src = btn.getAttribute("data-video-src");
        const poster = btn.getAttribute("data-video-poster");
        const name = btn.getAttribute("data-video-name") || "";
        if (!card || !src) return;

        const video = document.createElement("video");
        video.src = src;
        if (poster) video.poster = poster;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.className = "testimonial-video-el";
        video.setAttribute("aria-label", `Depoimento em vídeo de ${name}`);

        card.replaceWith(video);
        trackEvent("testimonial_video_play", { name });
      },
      { once: true }
    );
  });
}
