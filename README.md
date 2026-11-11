# Academic Portfolio & Student Management Platform

A multi-page personal portfolio for Ifeanyi Elenwo, built with only **HTML, CSS and JavaScript** — no frameworks, libraries or other languages.

**Live site:** `https://ks-profile.netlify.app`

## Pages

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Name & photo, time-aware welcome message, navigation, brief biography, focus areas, intro video |
| About Me | `about.html` | Education timeline, career aspirations, work experience timeline, technical skills table, interests |
| Projects | `projects.html` | Six projects from the CV with images, descriptions, links, category filter, details modal, summary table, other projects list |
| Academic Planner | `planner.html` | Add / complete / delete tasks, filter, search, sort, progress bar, task statistics |
| Contact | `contact.html` | Name, email, phone and message form with JavaScript validation, direct contact details |

## How the requirements are met

**HTML** — semantic elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`, `time`), forms (planner + contact), tables (technical skills, project summary), images, internal/external/`mailto:`/`tel:` hyperlinks, ordered/unordered/description lists, and an HTML5 `<video>` (`media/intro.mp4`).

**CSS** — one external stylesheet (`css/style.css`) with colour tokens in `:root` for a consistent scheme, CSS Grid and Flexbox layouts, styled sticky navigation with animated underline and a mobile hamburger menu, transitions and keyframe animations (fade-up hero, floating photo, scroll reveal, task slide-in, modal), and responsive breakpoints at 960px, 780px and 560px.

**JavaScript**
- `js/main.js` — mobile menu, active-link highlighting, scroll reveal (IntersectionObserver), back-to-top button, time-of-day greeting, toast messages.
- `js/planner.js` — task management: tasks kept in an array of objects, rendered with DOM methods, saved to `localStorage`; uses `filter`, `find`, `map`, `sort`, `forEach` and event delegation.
- `js/contact.js` — validation: no empty fields, email format (regex), phone digits only (regex + keystroke blocking), with live inline error messages; pre-fills the message when opened from a project's "Ask about this project" link.
- `js/projects.js` — category filter and details modal built from a data object.

## Run locally

No installation or build step is needed. Double-click `index.html` to open it in a browser, or use the **Live Server** extension in VS Code (right-click `index.html` → *Open with Live Server*).

