// theme.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Load previously saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // Toggle theme on click
  toggle?.addEventListener("click", () => {
    html.classList.toggle("dark");
    const newTheme = html.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
  });
});
