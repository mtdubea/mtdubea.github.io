// theme.js

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  const searchInputs = document.querySelectorAll(".search-bar input");
  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value.toLowerCase();
      const page = input.closest("main");
      const items = page.querySelectorAll("[data-title]");

      items.forEach((item) => {
        const title = item.getAttribute("data-title").toLowerCase();
        const category = item.getAttribute("data-category")?.toLowerCase() || "";
        item.style.display = title.includes(query) || category.includes(query) ? "block" : "none";
      });
    });
  });

  const tabMenus = document.querySelectorAll(".tab-menu");
  tabMenus.forEach((menu) => {
    const buttons = menu.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        const section = button.closest("main") || document;
        const items = section.querySelectorAll("[data-category]");

        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        items.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  });
});
