const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal: sections gently appear as visitors move down the page.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Thin progress line at the top of the page.
const progress = document.getElementById("pageProgress");
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
}, { passive: true });

// Interactive portfolio category filters.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".work-card");
const portfolioCount = document.getElementById("portfolioCount");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visible = 0;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    portfolioCount.textContent = `SHOWING ${String(visible).padStart(2, "0")} PROJECT${visible === 1 ? "" : "S"}`;
  });
});

// Project detail popups.
const projectInfo = {
  glow: {
    kicker: "CONCEPT Nº 01 · BUSINESS WEBSITE",
    title: "The Glow Room",
    description: "A calm, welcoming digital home for a beauty and wellness brand. The direction uses warm neutrals, editorial typography and a clear path to discover services or book an appointment.",
    direction: "Warm, editorial and welcoming"
  },
  slowday: {
    kicker: "CONCEPT Nº 02 · BUSINESS WEBSITE",
    title: "Slowday Coffee",
    description: "A relaxed café website concept built around atmosphere, a simple menu experience and the small details that make a neighbourhood coffee brand memorable.",
    direction: "Natural, relaxed and characterful"
  },
  north: {
    kicker: "CONCEPT Nº 03 · PERSONAL BRAND",
    title: "North Studio",
    description: "A confident portfolio direction for an independent creative professional. Strong typography, a restrained palette and a clear presentation of services and work.",
    direction: "Minimal, confident and expressive"
  }
};

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalKicker = document.getElementById("modalKicker");
const modalDescription = document.getElementById("modalDescription");
const modalDirection = document.getElementById("modalDirection");
let lastFocusedElement = null;

function openProject(key) {
  const project = projectInfo[key];
  if (!project) return;
  lastFocusedElement = document.activeElement;
  modalKicker.textContent = project.kicker;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalDirection.textContent = project.direction;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeProject() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

document.querySelectorAll(".project-open").forEach(button => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});
modal.querySelectorAll("[data-close-modal]").forEach(element => {
  element.addEventListener("click", closeProject);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeProject();
});
document.getElementById("modalContact").addEventListener("click", closeProject);

// FormSubmit handles the actual email delivery and sends a first-time activation email.
document.getElementById("contactForm")?.addEventListener("submit", event => {
  const form = event.currentTarget;
  if (!form.checkValidity()) return;
  const status = document.getElementById("formStatus");
  if (status) status.textContent = "Opening the secure form submission page…";
});
