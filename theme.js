/* ========================================================================
   theme.js — Site-wide theme + optional UI helpers
   - Three theme modes: "light" | "dark" | "system" (default)
   - Persists to localStorage
   - Accessible toggle with ARIA + tooltip text
   - Responds to OS changes when in "system" mode
   - Exposes optional search/filter/sort helpers without auto-binding
   ======================================================================== */

(() => {
  const STORAGE_KEY = "theme";
  const THEMES = { LIGHT: "light", DARK: "dark", SYSTEM: "system" };

  const state = {
    theme: getStoredTheme() || THEMES.SYSTEM,
    media: window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null,
  };

  // -------- Theme core --------
  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function storeTheme(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch {}
  }

  function isSystemDark() {
    return !!(state.media && state.media.matches);
  }

  function computeEffective(theme) {
    if (theme === THEMES.DARK) return true;
    if (theme === THEMES.LIGHT) return false;
    // system
    return isSystemDark();
  }

  function applyTheme(theme) {
    state.theme = theme;
    storeTheme(theme);

    const dark = computeEffective(theme);

    // Primary hook your CSS already uses
    document.body.classList.toggle("dark-mode", dark);

    // Secondary hook (optional if you want to target [data-theme] in the future)
    document.documentElement.setAttribute("data-theme", theme);

    // Update toggle UI if present
    updateToggleUI(dark, theme);
  }

  function cycleTheme() {
    // Light -> Dark -> System -> Light
    const order = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM];
    const next = order[(order.indexOf(state.theme) + 1) % order.length];
    applyTheme(next);
  }

  function updateToggleUI(isDark, mode) {
    const btn = document.getElementById("darkModeToggle");
    if (!btn) return;

    // ARIA and tooltip
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("data-mode", mode);

    const label =
      mode === THEMES.SYSTEM ? "Theme: System (follows OS)" :
      isDark ? "Theme: Dark" : "Theme: Light";

    const nextHint =
      mode === THEMES.LIGHT ? "Next: Dark" :
      mode === THEMES.DARK  ? "Next: System" :
                              "Next: Light";

    btn.title = `${label} • ${nextHint}`;
    btn.setAttribute("aria-label", `${label}. ${nextHint}.`);

    // Icon/text (keeps your single-button UI)
    // 🌙 for dark, ☀️ for light, 🖥️ for system
    const icon = mode === THEMES.SYSTEM ? "🖥️" : (isDark ? "🌙" : "☀️");
    // Preserve any inner text after an icon if you add it; default to icon only
    btn.textContent = icon;
  }

  // Initialize as soon as possible (runs on deferred load, before DOMContentLoaded)
  function initTheme() {
    // Ensure a baseline class present for progressive enhancement, if you want to target it in CSS
    document.documentElement.classList.add("js");

    // Apply current preference
    applyTheme(state.theme);

    // Listen to OS changes only when in "system" mode
    if (state.media && state.media.addEventListener) {
      state.media.addEventListener("change", () => {
        if ((getStoredTheme() || THEMES.SYSTEM) === THEMES.SYSTEM) applyTheme(THEMES.SYSTEM);
      });
    }
  }

  // Bind toggle (after DOM is interactive)
  function initToggle() {
    const btn = document.getElementById("darkModeToggle");
    if (!btn) return;

    // Button semantics for accessibility
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-pressed", "false");

    // Click / keyboard
    btn.addEventListener("click", cycleTheme);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycleTheme(); }
    });

    // Ensure UI reflects current state
    updateToggleUI(computeEffective(state.theme), state.theme);
  }

  // Public API (optional)
  const Theme = {
    get: () => state.theme,
    set: (mode) => applyTheme(mode),
    toggle: () => cycleTheme(),
    isDark: () => computeEffective(state.theme),
  };

  // -------- Optional UI helpers (no auto-binding to avoid conflicts) --------
  // Use these if/where you want:
  //   UI.handleSearch({ input: '#searchInput', cards: '.card', fields: ['[data-title]', '.cert-title', '.cert-badges'], count: '#resultCount' })
  //   UI.setupCategoryFilters({ buttons: '.filters [data-filter]', cards: '.cert-card' })
  //   UI.setupSort({ select: '#sort-select', cards: '.cert-card', attribute: 'title' })
  const UI = (() => {
    const toArray = (x) => Array.from(typeof x === "string" ? document.querySelectorAll(x) : x || []);
    const $(sel) => document.querySelector(sel);

    function debounce(fn, ms = 200) {
      let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }

    function normalize(str) {
      return (str || "").toLowerCase();
    }

    function searchableText(card, fields) {
      let buf = [];
      // common attributes
      buf.push(card.getAttribute("data-title"));
      buf.push(card.getAttribute("data-category"));
      buf.push(card.getAttribute("data-issuer"));

      // optional field selectors (e.g., '.cert-title', '.cert-badges')
      (fields || []).forEach(sel => {
        const el = card.querySelector(sel);
        if (el) buf.push(el.textContent);
      });

      // fallback to full text
      if (!buf.length) buf.push(card.textContent);

      return normalize(buf.join(" "));
    }

    function handleSearch(opts) {
      const inputEl = typeof opts.input === "string" ? document.querySelector(opts.input) : opts.input;
      const cards = toArray(opts.cards);
      const countEl = typeof opts.count === "string" ? document.querySelector(opts.count) : opts.count;
      const fields = opts.fields || [];

      if (!inputEl || cards.length === 0) return;

      const run = () => {
        const q = normalize(inputEl.value);
        let visible = 0;
        cards.forEach(card => {
          const text = searchableText(card, fields);
          const show = !q || text.includes(q);
          card.hidden = !show;
          if (show) visible++;
        });
        if (countEl) countEl.textContent = visible ? `${visible} shown` : "No results";
      };

      inputEl.addEventListener("input", debounce(run, 120));
      run();
    }

    function setupCategoryFilters(opts) {
      const buttons = toArray(opts.buttons);
      const cards = toArray(opts.cards);
      if (!buttons.length || !cards.length) return;

      let active = "all";

      function parseCats(card) {
        const raw = (card.getAttribute("data-category") || "").toLowerCase();
        return raw.split(/[,|\s]+/).filter(Boolean);
      }

      function apply() {
        let visible = 0;
        cards.forEach(card => {
          const cats = parseCats(card);
          const show = active === "all" || cats.includes(active);
          card.hidden = !show;
          if (show) visible++;
        });
        return visible;
      }

      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          active = (btn.getAttribute("data-filter") || "all").toLowerCase();
          apply();
        });
      });

      apply();
    }

    function setupSort(opts) {
      const select = typeof opts.select === "string" ? document.querySelector(opts.select) : opts.select;
      let cards = toArray(opts.cards);
      if (!select || !cards.length) return;

      const parent = cards[0].parentElement;

      select.addEventListener("change", () => {
        const by = select.value || opts.attribute || "title";
        cards = toArray(opts.cards); // refresh (in case list changed)
        const dataAttr = `data-${by}`;

        const sorted = cards.sort((a, b) => {
          const ta = normalize(a.getAttribute(dataAttr) || a.textContent);
          const tb = normalize(b.getAttribute(dataAttr) || b.textContent);
          return ta.localeCompare(tb, undefined, { numeric: true });
        });

        sorted.forEach(c => parent.appendChild(c));
      });
    }

    return { handleSearch, setupCategoryFilters, setupSort, debounce };
  })();

  // Expose APIs
  window.Theme = Theme;
  window.UI = UI;

  // Boot
  initTheme();
  document.addEventListener("DOMContentLoaded", initToggle);
})();
