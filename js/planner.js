/* ==========================================================================
   planner.js — Academic Planner (add, complete, delete, filter, search, sort)
   Tasks are stored in an array and saved to localStorage so they persist.
   ========================================================================== */

const STORAGE_KEY = "academic-planner-tasks";
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Starter tasks shown the first time the planner is opened
const SAMPLE_TASKS = [
  { title: "Submit portfolio website and GitHub repository links", subject: "Web Development", due: offsetDate(5), priority: "high", completed: false },
  { title: "Deploy portfolio to GitHub Pages", subject: "Web Development", due: offsetDate(2), priority: "medium", completed: false },
  { title: "Build the five portfolio pages", subject: "Web Development", due: offsetDate(-1), priority: "low", completed: true }
];

let tasks = [];
let currentFilter = "all";
let searchTerm = "";
let sortMode = "due";

// Cached DOM elements
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const subjectInput = document.getElementById("task-subject");
const dueInput = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const formError = document.getElementById("task-error");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("task-search");
const sortSelect = document.getElementById("task-sort");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearButton = document.getElementById("clear-completed");

/* ---------- Helpers ---------- */

function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toInputDate(d);
}

function toInputDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

function formatDate(value) {
  if (!value) return "No due date";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function isOverdue(task) {
  return !task.completed && task.due !== "" && task.due < toInputDate(new Date());
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- Storage ---------- */

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    // Storage may be blocked (private mode); fall back to samples
  }
  return SAMPLE_TASKS.map(function (task) {
    return Object.assign({ id: createId(), createdAt: Date.now() }, task);
  });
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // Ignore — the planner still works for this visit
  }
}

/* ---------- Task operations ---------- */

function addTask(title, subject, due, priority) {
  const task = {
    id: createId(),
    title: title,
    subject: subject,
    due: due,
    priority: priority,
    completed: false,
    createdAt: Date.now()
  };
  tasks.push(task);
  saveTasks();
  render();
  showToast("Task added: " + title);
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
  showToast(task.completed ? "Nice work! Task completed." : "Task marked as pending.");
}

function deleteTask(id, element) {
  // Play the exit animation before removing from the array
  element.classList.add("removing");
  setTimeout(function () {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
    showToast("Task deleted.");
  }, 280);
}

function clearCompleted() {
  const count = tasks.filter(function (t) { return t.completed; }).length;
  if (count === 0) {
    showToast("There are no completed tasks to clear.");
    return;
  }
  if (!confirm("Delete " + count + " completed task(s)?")) return;
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  render();
  showToast(count + " completed task(s) cleared.");
}

/* ---------- Rendering ---------- */

function getVisibleTasks() {
  return tasks
    .filter(function (task) {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    })
    .filter(function (task) {
      const text = (task.title + " " + task.subject).toLowerCase();
      return text.includes(searchTerm);
    })
    .sort(function (a, b) {
      if (sortMode === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (sortMode === "newest") return b.createdAt - a.createdAt;
      // Default: by due date, tasks without a date last
      return (a.due || "9999").localeCompare(b.due || "9999");
    });
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task" + (task.completed ? " completed" : "");
  item.dataset.id = task.id;
  item.dataset.priority = task.priority;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");

  const body = document.createElement("div");
  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const badge = document.createElement("span");
  badge.className = "badge badge-" + task.priority;
  badge.textContent = task.priority;
  meta.appendChild(badge);

  if (task.subject) {
    const subject = document.createElement("span");
    subject.textContent = "📘 " + task.subject;
    meta.appendChild(subject);
  }

  const due = document.createElement("span");
  due.textContent = "📅 " + formatDate(task.due);
  if (isOverdue(task)) {
    due.classList.add("overdue");
    due.textContent += " · Overdue";
  }
  meta.appendChild(due);

  body.append(title, meta);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "task-delete";
  remove.innerHTML = "&#10005;";
  remove.setAttribute("aria-label", "Delete \"" + task.title + "\"");

  item.append(checkbox, body, remove);
  return item;
}

function render() {
  const visible = getVisibleTasks();
  list.innerHTML = "";
  visible.forEach(function (task) {
    list.appendChild(createTaskElement(task));
  });

  emptyState.hidden = visible.length > 0;
  emptyState.textContent = tasks.length === 0
    ? "No tasks yet — add your first one using the form."
    : "No tasks match this view.";

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(function (t) { return t.completed; }).length;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = total - done;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-overdue").textContent = overdue;
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-bar").parentElement.setAttribute("aria-valuenow", percent);
}

/* ---------- Event handling ---------- */

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    formError.textContent = "Please enter a task title.";
    titleInput.focus();
    return;
  }
  if (title.length > 100) {
    formError.textContent = "Keep the title under 100 characters.";
    return;
  }

  formError.textContent = "";
  addTask(title, subjectInput.value.trim(), dueInput.value, priorityInput.value);
  form.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

// One listener on the list handles every task (event delegation)
list.addEventListener("click", function (event) {
  const item = event.target.closest(".task");
  if (!item) return;
  if (event.target.classList.contains("task-check")) toggleTask(item.dataset.id);
  if (event.target.closest(".task-delete")) deleteTask(item.dataset.id, item);
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (b) {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    render();
  });
});

searchInput.addEventListener("input", function () {
  searchTerm = searchInput.value.trim().toLowerCase();
  render();
});

sortSelect.addEventListener("change", function () {
  sortMode = sortSelect.value;
  render();
});

clearButton.addEventListener("click", clearCompleted);

/* ---------- Start ---------- */
dueInput.min = toInputDate(new Date());
tasks = loadTasks();
render();
