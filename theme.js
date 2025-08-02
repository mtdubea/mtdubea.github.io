// DARK MODE TOGGLE
const themeToggle = document.getElementById('darkModeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Initialize on load
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  });
}

// SEARCH LOGIC
function handleSearch(inputSelector, cardSelector) {
  const input = document.querySelector(inputSelector);
  const cards = document.querySelectorAll(cardSelector);
  if (!input || cards.length === 0) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    cards.forEach(card => {
      const text = card.getAttribute('data-title')?.toLowerCase() || card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'block' : 'none';
    });
  });
}

// CATEGORY FILTER TABS
function setupCategoryFilters(buttonSelector, cardSelector) {
  const buttons = document.querySelectorAll(buttonSelector);
  const cards = document.querySelectorAll(cardSelector);
  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      cards.forEach(card => {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        card.style.display = matches ? 'block' : 'none';
      });
    });
  });
}

// SORT FUNCTION
function setupSort(selectSelector, cardSelector) {
  const select = document.querySelector(selectSelector);
  const grid = document.querySelector(cardSelector)?.parentElement;
  if (!select || !grid) return;

  select.addEventListener('change', () => {
    const cards = Array.from(document.querySelectorAll(cardSelector));
    const sortType = select.value;

    const sorted = cards.sort((a, b) => {
      const aText = a.getAttribute(`data-${sortType}`)?.toLowerCase() || '';
      const bText = b.getAttribute(`data-${sortType}`)?.toLowerCase() || '';
      return aText.localeCompare(bText);
    });

    sorted.forEach(card => grid.appendChild(card));
  });
}

// INIT ALL BEHAVIOR
window.addEventListener('DOMContentLoaded', () => {
  handleSearch('#searchInput', '.card');
  handleSearch('#cert-search', '.cert-card');

  setupCategoryFilters('.tab-button', '.cert-card');
  setupSort('#sort-select', '.cert-card');
});
