
// 🌗 Dark Mode Toggle
const toggleButton = document.getElementById("darkModeToggle");
toggleButton?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// 🌓 Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});

// 🔍 Search Filter Logic
const searchInput = document.getElementById("cert-search") || document.getElementById("searchInput");
const certCards = document.querySelectorAll(".cert-card, .card");

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  certCards.forEach(card => {
    const title = card.getAttribute("data-title")?.toLowerCase() || card.textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
});

// 🧭 Tab Filtering by Category
const tabButtons = document.querySelectorAll(".tab-button");
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".tab-button.active")?.classList.remove("active");
    button.classList.add("active");
    const category = button.getAttribute("data-filter");
    certCards.forEach(card => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ↕️ Sort Logic
const sortSelect = document.getElementById("sort-select");
sortSelect?.addEventListener("change", () => {
  const grid = document.querySelector(".certifications-grid");
  if (!grid) return;
  const cards = Array.from(grid.children);
  const type = sortSelect.value;
  let sorted = [];

  if (type === "title") {
    sorted = cards.sort((a, b) =>
      a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"))
    );
  } else if (type === "category") {
    sorted = cards.sort((a, b) =>
      a.getAttribute("data-category").localeCompare(b.getAttribute("data-category"))
    );
  } else {
    sorted = cards;
  }

  sorted.forEach(card => grid.appendChild(card));
});
