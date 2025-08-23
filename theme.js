// Minimal helpers (no dark-mode logic)

// Smooth-scroll for on-page anchors (accessibility-friendly)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (!id || id === '#') return;
  const el = document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Add :focus-visible polyfill feel on mouse users (visible ring only for keyboard)
(function () {
  let hadKeyboardEvent = false;
  const ringClass = 'focus-ring';

  function onKeyDown(e) {
    if (e.key === 'Tab' || e.keyCode === 9) hadKeyboardEvent = true;
  }
  function onPointerDown() { hadKeyboardEvent = false; }
  function onFocus(e) {
    if (hadKeyboardEvent) e.target.classList.add(ringClass);
  }
  function onBlur(e) { e.target.classList.remove(ringClass); }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
})();
