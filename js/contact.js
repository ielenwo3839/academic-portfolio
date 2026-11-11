/* ==========================================================================
   contact.js — contact form validation
   Rules: no empty fields, valid email format, phone contains digits only.
   ========================================================================== */

const contactForm = document.getElementById("contact-form");
const successAlert = document.getElementById("form-success");
const errorAlert = document.getElementById("form-error");
const messageField = document.getElementById("message");
const charCount = document.getElementById("char-count");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const DIGITS_ONLY = /^[0-9]+$/;
const MAX_MESSAGE = 500;

// Each field has a list of rules; the first failing rule's message is shown
const validators = {
  name: [
    { test: function (v) { return v !== ""; }, message: "Name is required." },
    { test: function (v) { return v.length >= 2; }, message: "Name must be at least 2 characters." }
  ],
  email: [
    { test: function (v) { return v !== ""; }, message: "Email address is required." },
    { test: function (v) { return EMAIL_PATTERN.test(v); }, message: "Enter a valid email, e.g. name@example.com." }
  ],
  phone: [
    { test: function (v) { return v !== ""; }, message: "Phone number is required." },
    { test: function (v) { return DIGITS_ONLY.test(v); }, message: "Phone number must contain digits only (no spaces or symbols)." },
    { test: function (v) { return v.length >= 7 && v.length <= 15; }, message: "Phone number must be 7 to 15 digits long." }
  ],
  message: [
    { test: function (v) { return v !== ""; }, message: "Message is required." },
    { test: function (v) { return v.length >= 10; }, message: "Message must be at least 10 characters." },
    { test: function (v) { return v.length <= MAX_MESSAGE; }, message: "Message must be " + MAX_MESSAGE + " characters or fewer." }
  ]
};

/* Validate one field, update its error text and styling, return true if valid */
function validateField(field) {
  const rules = validators[field.name];
  const value = field.value.trim();
  const row = field.closest(".form-row");
  const errorEl = document.getElementById(field.name + "-error");

  const failed = rules.find(function (rule) { return !rule.test(value); });

  row.classList.toggle("invalid", Boolean(failed));
  row.classList.toggle("valid", !failed);
  field.setAttribute("aria-invalid", failed ? "true" : "false");
  errorEl.textContent = failed ? failed.message : "";

  return !failed;
}

function validateForm() {
  const fields = Array.from(contactForm.elements).filter(function (el) {
    return validators[el.name];
  });
  const results = fields.map(validateField);
  const firstInvalid = fields[results.indexOf(false)];
  if (firstInvalid) firstInvalid.focus();
  return results.every(Boolean);
}

/* Live feedback: validate after the user leaves a field, then on every keystroke */
Array.from(contactForm.elements).forEach(function (field) {
  if (!validators[field.name]) return;
  field.addEventListener("blur", function () {
    field.dataset.touched = "true";
    validateField(field);
  });
  field.addEventListener("input", function () {
    if (field.dataset.touched) validateField(field);
  });
});

/* Block non-digit characters from being typed into the phone field */
document.getElementById("phone").addEventListener("keypress", function (event) {
  if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
    event.preventDefault();
    showToast("Only digits are allowed in the phone number.");
  }
});

function updateCharCount() {
  const length = messageField.value.length;
  charCount.textContent = length + " / " + MAX_MESSAGE;
  charCount.style.color = length > MAX_MESSAGE ? "var(--danger)" : "";
}
messageField.addEventListener("input", updateCharCount);

/* Pre-fill the message when arriving from a project's "Ask about this project" link */
const askedProject = new URLSearchParams(window.location.search).get("project");
if (askedProject) {
  messageField.value = "Hi Ifeanyi, I'd like to know more about the " + askedProject + " project.";
  updateCharCount();
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  successAlert.hidden = true;
  errorAlert.hidden = true;

  if (!validateForm()) {
    errorAlert.hidden = false;
    return;
  }

  // No backend: simulate sending and greet the sender by name
  const name = contactForm.elements.name.value.trim().split(" ")[0];
  const button = contactForm.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending…";

  setTimeout(function () {
    contactForm.reset();
    successAlert.textContent = "Thank you, " + name + "! Your message has been sent. I'll get back to you soon.";
    successAlert.hidden = false;
    charCount.textContent = "0 / " + MAX_MESSAGE;
    contactForm.querySelectorAll(".form-row").forEach(function (row) {
      row.classList.remove("valid", "invalid");
    });
    Array.from(contactForm.elements).forEach(function (el) { delete el.dataset.touched; });
    button.disabled = false;
    button.textContent = "Send message";
    successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 900);
});

contactForm.addEventListener("reset", function () {
  successAlert.hidden = true;
  errorAlert.hidden = true;
});
