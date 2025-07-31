// theme.js — toggles dark/light mode using localStorage

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.theme-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  // Apply stored or preferred theme on load
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
