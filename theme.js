// === THEME TOGGLE ===
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Load theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// === UNIVERSAL SEARCH ===
const searchInput = document.querySelector('.search-bar input');
const searchableItems = document.querySelectorAll('[data-title]');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();

    searchableItems.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      item.style.display = title.includes(q) ? 'block' : 'none';
    });
  });
}

// === FILTERING BY CATEGORY ===
const tabButtons = document.querySelectorAll('.tab-menu button');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    const cards = document.querySelectorAll('[data-category]');

    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// === SORTING BY TITLE (if needed) ===
const sortAlphabetically = (parentSelector, itemSelector) => {
  const container = document.querySelector(parentSelector);
  if (!container) return;

  const items = Array.from(container.querySelectorAll(itemSelector));
  items.sort((a, b) => {
    const titleA = a.dataset.title.toLowerCase();
    const titleB = b.dataset.title.toLowerCase();
    return titleA.localeCompare(titleB);
  });

  items.forEach(item => container.appendChild(item));
};

// Call for certification cards (or others)
sortAlphabetically('.certifications-grid', '.cert-card');
