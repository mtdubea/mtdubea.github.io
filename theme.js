// theme.js — shared lightweight enhancements for the full portfolio

(function loadEnhancementAssets(){
  const base = document.currentScript ? new URL('.', document.currentScript.src).href : '/';
  const cssHref = new URL('enhancements.css', base).href;
  const jsHref = new URL('enhancements.js', base).href;

  if(!document.querySelector('link[href$="enhancements.css"]')){
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  if(!document.querySelector('script[src$="enhancements.js"]')){
    const script = document.createElement('script');
    script.defer = true;
    script.src = jsHref;
    document.head.appendChild(script);
  }
})();

/* External links: open safely */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const url = a.getAttribute('href');
  const isExternal = /^https?:\/\//i.test(url) && !url.includes(location.host);
  if (isExternal) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
});

/* Skip-link/hash focus target for better accessibility */
(function() {
  const hash = window.location.hash;
  if (hash && document.getElementById(hash.slice(1))) {
    const el = document.getElementById(hash.slice(1));
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
})();

/* Active nav state across subpaths */
(function() {
  const links = document.querySelectorAll('.site-nav a[href]');
  const here = location.pathname.replace(/index\.html?$/,'').replace(/\/$/, '');
  links.forEach(a => {
    const href = new URL(a.getAttribute('href'), location.href).pathname.replace(/index\.html?$/,'').replace(/\/$/, '');
    if (href === here) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();
