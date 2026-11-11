/* ==========================================================================
   projects.js — category filter and "details" modal for the Projects page
   ========================================================================== */

// Extra details for each project, keyed by the button's data-details id
const projectDetails = {
  ocr: {
    title: "OCR Prescription Verification Pipeline",
    organisation: "Axum Technologies · 2022 – Present",
    summary: "An OCR-driven pipeline for parsing and verifying prescriptions.",
    features: ["Processes uploaded prescription documents", "Extracts structured prescription data", "Validates the extracted results", "Supports automated verification workflows"],
    tools: ["OCR", "Data extraction", "Validation", "Automation"],
    screenshots: [
      { src: "images/ocr-step1-usage.png", caption: "Step 1 — Usage: choose prescription or plano lenses" },
      { src: "images/ocr-step2-lens-type.png", caption: "Step 2 — Lens type: single vision, digital, progressive or bifocal" },
      { src: "images/ocr-step3-prescription.png", caption: "Step 3 — Prescription: enter PD and upload the prescription file" }
    ]
  },
  apparel: {
    title: "Apparel Customization Studio",
    organisation: "Axum Technologies · 2022 – Present",
    summary: "An interactive studio where customers design their own apparel and order it online.",
    features: ["Interactive product design", "Artwork placement on configurable print areas", "Product variants", "Persistent (saved) designs", "E-commerce ordering"],
    tools: ["Product design", "E-commerce"],
    screenshots: [
      { src: "images/apparel-step1-product.png", caption: "Product page — choose to customize the item and a decoration method" },
      { src: "images/apparel-step2-upload-art.png", caption: "Upload art — place, resize and align artwork inside the print area" },
      { src: "images/apparel-step3-add-text.png", caption: "Add text — edit font, colour, size and shape on the back print area" },
      { src: "images/apparel-step4-review.png", caption: "Review — check placements, choose sizes and quantities, then add to cart" }
    ]
  },
  shopify: {
    title: "Shopify Verification & Redemption",
    organisation: "Axum Technologies · 2022 – Present",
    summary: "Verification and redemption infrastructure for Shopify orders.",
    features: ["Validates orders through backend services", "Validates redemption codes", "Listens for Shopify webhooks", "Uses Shopify GraphQL APIs"],
    tools: ["Shopify GraphQL API", "Webhooks", "Backend services"]
  },
  fitness: {
    title: "Accessible Fitness App",
    organisation: "SekondSkinSociety (Remote) · 2024",
    summary: "A cross-platform Android and iOS fitness application with a consistent, performant mobile experience.",
    features: ["Screen reader compatibility", "Voice guidance", "Adjustable font sizes", "Inclusive navigation patterns", "Data synchronization with backend services"],
    tools: ["React Native", "Node.js", "MongoDB", "PostgreSQL"]
  },
  audit: {
    title: "Accessibility Audit Platform",
    organisation: "CurbcutOS (Remote) · 2023",
    summary: "A digital accessibility audit platform combining accessible dashboards with backend audit processing and reporting.",
    features: ["Automated and manual accessibility audits", "Accessible dashboards and reporting", "Create, update and track issues in Jira", "Accessibility-first UI aligned with WCAG"],
    tools: ["Axe-core", "Sitemorse", "Jira API", "WCAG"]
  },
  payments: {
    title: "Student Dues Payment Platform",
    organisation: "University of Uyo · 2016 – 2020",
    summary: "An online payment platform for students' dues payments.",
    features: ["Online payment of students' dues", "Payment processing through Remita", "Payment processing through Paystack"],
    tools: ["PHP", "JavaScript", "Remita API", "Paystack API"]
  }
};

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");
const countLabel = document.getElementById("project-count");
const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
let lastFocused = null;

/* ---------- Filtering ---------- */

function filterProjects(category) {
  let shown = 0;
  cards.forEach(function (card) {
    const categories = card.dataset.category.split(" ");
    const match = category === "all" || categories.includes(category);
    card.classList.toggle("is-hidden", !match);
    if (match) shown++;
  });
  countLabel.textContent = "Showing " + shown + " of " + cards.length + " projects";
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    filterProjects(button.dataset.category);
  });
});

/* ---------- Modal ---------- */

function openModal(id) {
  const project = projectDetails[id];
  if (!project) return;

  const featureItems = project.features.map(function (f) { return "<li>" + f + "</li>"; }).join("");
  const toolTags = project.tools.map(function (t) { return '<li class="tag">' + t + "</li>"; }).join("");
  const gallery = (project.screenshots || []).map(function (shot) {
    return '<figure class="modal-shot"><img src="' + shot.src + '" alt="' + shot.caption + '" loading="lazy"><figcaption>' + shot.caption + "</figcaption></figure>";
  }).join("");

  modalBody.innerHTML =
    '<span class="eyebrow">' + project.organisation + "</span>" +
    '<h2 id="modal-title">' + project.title + "</h2>" +
    "<p>" + project.summary + "</p>" +
    "<h3>Key features</h3>" +
    '<ul class="check-list">' + featureItems + "</ul>" +
    "<h3>Technologies &amp; concepts</h3>" +
    '<ul class="tag-list">' + toolTags + "</ul>" +
    (gallery ? "<h3>Screenshots</h3>" + gallery : "");

  lastFocused = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll("[data-details]").forEach(function (button) {
  button.addEventListener("click", function () {
    openModal(button.dataset.details);
  });
});

modal.addEventListener("click", function (event) {
  // Close when clicking the dark backdrop or the × button
  if (event.target === modal || event.target.closest(".modal-close")) closeModal();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

filterProjects("all");
