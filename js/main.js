/* ==========================================================================
   main.js — shared behaviour for every page
   (navigation, scroll effects, reveal animations, footer, toast messages)
   ========================================================================== */

// Flag that JavaScript is running so CSS can enable reveal animations
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  highlightActiveLink();
  setupHeaderShadow();
  setupRevealOnScroll();
  setupBackToTop();
  setGreeting();
  setFooterYear();
});

/* Mobile menu: open/close the nav with the hamburger button */
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after a link is chosen or Escape is pressed
  links.addEventListener("click", function (event) {
    if (event.target.tagName === "A") closeMenu();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
}

/* Mark the current page's link as active */
function highlightActiveLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* Add a shadow to the sticky header once the page scrolls */
function setupHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* Fade elements in as they enter the viewport */
function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) { item.classList.add("visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (item) { observer.observe(item); });
}

/* Floating "back to top" button */
function setupBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;
  window.addEventListener("scroll", function () {
    button.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Time-aware greeting on the homepage */
function setGreeting() {
  const target = document.getElementById("greeting");
  if (!target) return;
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  target.textContent = greeting + ", welcome to my portfolio";
}

function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}

/* Small notification used by the planner and contact pages */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}
