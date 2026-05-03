// theme.js — shared portfolio enhancements
// Lightweight progressive enhancement layer for GitHub Pages.

(function () {
  const doc = document;
  const root = doc.documentElement;
  root.classList.add("js-ready");

  const currentScript = doc.currentScript;
  const scriptUrl = currentScript ? new URL(currentScript.getAttribute("src") || "theme.js", location.href) : new URL("theme.js", location.href);
  const baseUrl = scriptUrl.href.slice(0, scriptUrl.href.lastIndexOf("/") + 1);

  function injectEnhancementStyles() {
    if (doc.querySelector('link[data-enhancement-css="true"]')) return;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = baseUrl + "enhancements.css";
    link.dataset.enhancementCss = "true";
    doc.head.appendChild(link);
  }

  function ensureMeta() {
    const canonical = doc.querySelector('link[rel="canonical"]') || doc.createElement("link");
    canonical.rel = "canonical";
    canonical.href = location.origin + location.pathname.replace(/index\.html?$/, "");
    if (!canonical.parentNode) doc.head.appendChild(canonical);

    if (!doc.querySelector('meta[name="theme-color"]')) {
      const meta = doc.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0a66c2";
      doc.head.appendChild(meta);
    }

    if (!doc.querySelector('link[rel="manifest"]')) {
      const manifest = doc.createElement("link");
      manifest.rel = "manifest";
      manifest.href = baseUrl + "site.webmanifest";
      doc.head.appendChild(manifest);
    }
  }

  function safeExternalLinks() {
    doc.addEventListener("click", (event) => {
      const a = event.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href) && !href.includes(location.host)) {
        a.target = a.target || "_blank";
        a.rel = "noopener noreferrer";
      }
    });
  }

  function activeNavState() {
    const here = location.pathname.replace(/\/index\.html?$/, "/");
    doc.querySelectorAll('nav a[href], .site-nav a[href], .main-nav a[href]').forEach((link) => {
      const url = new URL(link.getAttribute("href"), location.href);
      const path = url.pathname.replace(/\/index\.html?$/, "/");
      if (path === here) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function themeControls() {
    const key = "portfolio-theme";
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = stored ? stored === "dark" : prefersDark && doc.body.classList.contains("dark");

    if (useDark) {
      doc.body.classList.add("dark", "dark-mode");
    }

    doc.querySelectorAll("#themeToggle, [data-theme-toggle]").forEach((button) => {
      button.setAttribute("type", "button");
      button.setAttribute("aria-label", "Toggle light and dark mode");
      button.addEventListener("click", () => {
        const isDark = doc.body.classList.toggle("dark");
        doc.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem(key, isDark ? "dark" : "light");
        button.textContent = isDark ? "☀️" : "🌙";
      });
      button.textContent = doc.body.classList.contains("dark") ? "☀️" : "🌙";
    });
  }

  function scrollEnhancements() {
    const progress = doc.createElement("div");
    progress.id = "readingProgress";
    progress.setAttribute("aria-hidden", "true");
    doc.body.appendChild(progress);

    const topButton = doc.createElement("button");
    topButton.id = "backToTop";
    topButton.type = "button";
    topButton.innerHTML = "↑";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    doc.body.appendChild(topButton);

    const header = doc.querySelector(".site-header, body > header");
    const update = () => {
      const scrollTop = window.scrollY || doc.documentElement.scrollTop;
      const height = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = height > 0 ? `${Math.min(100, (scrollTop / height) * 100)}%` : "0%";
      topButton.classList.toggle("is-visible", scrollTop > 500);
      if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function mediaEnhancements() {
    doc.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.loading = "lazy";
      if (!img.hasAttribute("decoding")) img.decoding = "async";
      const inLink = img.closest("a");
      const isTiny = (img.naturalWidth && img.naturalWidth < 220) || /favicon|logo|headshot/i.test(img.src);
      if (!inLink && !isTiny && !img.closest(".hero")) img.dataset.enhancedLightbox = "true";
    });

    const box = doc.createElement("div");
    box.className = "image-lightbox";
    box.innerHTML = '<button class="image-lightbox__close" type="button" aria-label="Close image viewer">×</button><div><img alt=""><p class="image-lightbox__caption"></p></div>';
    doc.body.appendChild(box);
    const boxImg = box.querySelector("img");
    const caption = box.querySelector(".image-lightbox__caption");
    const close = () => box.classList.remove("is-open");
    box.querySelector("button").addEventListener("click", close);
    box.addEventListener("click", (event) => { if (event.target === box || event.target === boxImg) close(); });
    doc.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
    doc.addEventListener("click", (event) => {
      const img = event.target.closest('img[data-enhanced-lightbox="true"]');
      if (!img) return;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt || "Expanded project image";
      caption.textContent = img.alt || "";
      box.classList.add("is-open");
    });
  }

  function tableAndCodeEnhancements() {
    doc.querySelectorAll("table").forEach((table) => {
      if (table.parentElement && table.parentElement.classList.contains("table-wrap")) return;
      const wrap = doc.createElement("div");
      wrap.className = "table-wrap";
      wrap.tabIndex = 0;
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });

    doc.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement && pre.parentElement.classList.contains("code-shell")) return;
      const shell = doc.createElement("div");
      shell.className = "code-shell";
      pre.parentNode.insertBefore(shell, pre);
      shell.appendChild(pre);
      const button = doc.createElement("button");
      button.type = "button";
      button.className = "copy-code-button";
      button.textContent = "Copy";
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(pre.innerText.trim());
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1400);
      });
      shell.appendChild(button);
    });
  }

  function searchShortcut() {
    doc.addEventListener("keydown", (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = (event.target.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      const search = doc.querySelector('input[type="search"], #searchInput, input[placeholder*="Search" i]');
      if (!search) return;
      event.preventDefault();
      search.focus();
      search.select();
    });
  }

  function languageTogglePolish() {
    doc.querySelectorAll("#langToggle").forEach((button) => {
      button.type = "button";
      button.setAttribute("aria-label", "Language toggle placeholder");
      button.addEventListener("click", () => {
        button.textContent = "English";
        const msg = doc.createElement("p");
        msg.className = "small";
        msg.textContent = "Spanish content can be added next; current pages are optimized in English.";
        button.insertAdjacentElement("afterend", msg);
        setTimeout(() => msg.remove(), 3500);
      }, { once: true });
    });
  }

  function init() {
    injectEnhancementStyles();
    ensureMeta();
    safeExternalLinks();
    activeNavState();
    themeControls();
    scrollEnhancements();
    mediaEnhancements();
    tableAndCodeEnhancements();
    searchShortcut();
    languageTogglePolish();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
