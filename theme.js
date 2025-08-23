// theme.js — shared, lightweight enhancements (no dark mode)

/* External links: open safely */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const url = a.getAttribute('href');
  const isExternal = /^https?:\/\//i.test(url) && !url.includes(location.host);
  if (isExternal) a.setAttribute('rel', 'noopener');
});

/* Skip-link: focus target for better a11y */
(function() {
  const hash = window.location.hash;
  if (hash && document.getElementById(hash.slice(1))) {
    const el = document.getElementById(hash.slice(1));
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
})();

/* Small helper for “active” nav state if using subpaths */
(function() {
  const links = document.querySelectorAll('.site-nav a[href]');
  const here = location.pathname.replace(/index\.html?$/,'');
  links.forEach(a => {
    const href = a.getAttribute('href').replace(/index\.html?$/,'');
    if (href === here) a.classList.add('active');
  });
})();
