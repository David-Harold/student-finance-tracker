# Student Finance Tracker

A responsive, accessible spending tracker for students, built with vanilla HTML, CSS and JavaScript (ES modules). No frameworks, no build step. Data is stored in the browser (`localStorage`).

- **Live site:** https://david-harold.github.io/student-finance-tracker/
- **Repository:** https://github.com/David-Harold/student-finance-tracker
- **Author:** David-Harold Koffi-Essiben, African Leadership University, Kigali
- **Contact:** d.koffiessi@alustudent.com
- **Demo video:** FILL IN unlisted YouTube URL when uploaded

## Purpose

Students often lose track of small daily spendings. This tracker lets a student record each expense, search and sort them, see simple totals, and set a monthly spending cap that warns when exceeded. It tracks **spending only** (no income).

## Features

| Area | What it does |
|---|---|
| Records | Add, edit and delete expenses (description, amount, category, date, currency). |
| Responsive views | Cards below 768px, table from 768px upward, both drawn from one data source. |
| Sorting | By date, description or amount, ascending or descending. |
| Regex search | Live search over description and category with a case-sensitivity toggle; matches are highlighted with `<mark>`. Invalid patterns show a message and never crash the page. |
| Dashboard | Total spent (in RWF), per-category breakdown, cap status. |
| Monthly cap | Set a cap in RWF. A live region shows what remains or announces an overspend. |
| Import / export | Export all records as JSON; import a JSON file after validation (the whole file is rejected if any record is invalid). |
| Persistence | Records and cap survive reloads via `localStorage`. |
| Seed data | `seed.json` holds 10 varied records for testing import. |

## Data model

Each record has: `id` (number), `description`, `amount` (number, above zero, two decimals at most), `category`, `date` (`YYYY-MM-DD`), `currency` (`rwf`, `usd` or `gbp`), `createdAt` (ISO timestamp), and `updatedAt` once edited.

## Regex catalogue

| Rule | Pattern | Purpose |
|---|---|---|
| Description | `/^\S(.*\S)?$/` | No leading or trailing space. |
| Amount | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Whole number or up to two decimals; no leading zeros. |
| Date | `/^\d{4}-\d{2}-\d{2}$/` | Shape `YYYY-MM-DD`. |
| Category | `/^[a-zA-Z]([a-zA-Z -]*[a-zA-Z])?$/` | Letters, spaces and hyphens, starting and ending with a letter. |
| Duplicate words (advanced) | `/\b(\w+)\s+\1\b/i` | Back-reference; the form rejects a description if this matches (for example "coffee coffee"). |

The search box accepts any user pattern, compiled with `new RegExp` inside `try/catch`, with the `i` flag unless "case sensitive" is ticked. The filtering regex never uses the `g` flag (a global regex keeps `lastIndex` between `.test()` calls); the highlighter makes a global copy for `matchAll`.

### Known limits

- The date rule checks **shape only**: `2026-13-45` passes the regex. No further check exists; the shape rule is the only guard.
- The duplicate-word rule catches **adjacent** repeats only.
- The amount pattern accepts `0`, so the submit code also requires an amount above zero.
- The currency rates are **manual and approximate** (set on 2026-10-18): RWF 1, USD 1 300, GBP 1 650. They are not live.
- Import **replaces** all current records after a confirmation.
- An unknown currency would be counted as RWF in totals; the form only allows the three listed.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a skip link.
- Every control has a visible `<label>`; error text is linked with `aria-describedby`, and invalid fields carry `aria-invalid`.
- Live regions: form status and search count are polite; the cap overspend message is assertive.
- On a failed submit, focus moves to the first invalid field.
- Visible focus outlines; text and focus colours chosen for WCAG AA contrast; animations disabled under `prefers-reduced-motion`.
- Table has a caption and `scope="col"` headers.

### Keyboard map

`Tab` / `Shift+Tab` moves through links and controls; `Enter` activates buttons and submits the form; `Space` toggles the case-sensitive checkbox; the first `Tab` on page load reveals the skip link. Edit puts focus in the description field. (Safari needs `Option+Tab` for links.)

## Safe rendering

User text is always inserted with `textContent` or text nodes. Highlights are built with `createTextNode` and `<mark>` elements, never `innerHTML`, so pasted markup cannot execute.

## Project structure

```
index.html
styles/main.css
scripts/main.js        wiring, form handling, events
scripts/validators.js  regex rules (+ record validator)
scripts/storage.js     localStorage load and save
scripts/sort.js        sorting
scripts/search.js      safe regex compilation
scripts/stats.js       totals and category tally
scripts/ui.js          rendering, highlighting, dashboard
scripts/transfer.js    export and import
seed.json              sample data
tests.html             in-browser assertions (validators, search, sort)
codevibe-reports/      authorship report
```

## Running locally

ES modules need a server (opening the file directly fails):

```
npx serve
```

Then open the address shown. For the tests, open `tests.html` the same way.

## Responsive design

Mobile first. Base styles target phones; `@media (min-width: 768px)` and `(min-width: 1024px)` widen padding and max width, and switch cards to the table.

## Use of AI

The assignment permits AI for this README only. I state below, as exactly as I can, how AI (Claude) was used in this project.

- **README:** drafted with AI assistance, then checked and edited by me.
- **Learning and review:** during development Claude explained concepts (ES modules, regex pitfalls, DOM building, sorting, accessibility) and reviewed code that I had written, pointing out errors by line number. It gave no templates or skeletons; the project code is mine.
- **Early milestones:** FILL IN — describe what Claude produced in M1 and M2 and what you kept or replaced.
- **CodeVibe:** the authorship report is in `codevibe-reports/`. FILL IN — state the percentage shown, the Claude Code session that raised it, and whether you informed your instructors.

## Sources

- MDN Web Docs: HTML, CSS, JavaScript, Regular expressions, `localStorage`, ES modules.
- WebAIM: contrast and accessible forms guidance.
