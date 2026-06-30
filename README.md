# Orientation for Environmental Predictions

A community-authored, interactive web resource for researchers and practitioners designing, executing, and communicating rigorous quantitative predictions in ecology and environmental science.

**Live site:** https://martawenta.github.io/prediction_webpage/basis.html

---

## What this resource is

The page walks through the full modelling cycle as five collapsible phases:

| Phase | Title | Primary role |
|-------|-------|--------------|
| 1 | Setting the stage: Why predict? | Modeller + Stakeholder |
| 2 | Identifying data and modelling approaches | Modeller |
| 3 | Modelling | Modeller |
| 4 | Predicting | Modeller |
| 5 | Utilisation | Modeller + Stakeholder |

Below the phases, three additional collapsible sections provide:

- **Checklist** — commonly overlooked issues at each stage
- **Bones of contention** — open scientific debates with no settled answer
- **Glossary** — definitions for all technical terms used in the resource (hover-activated tooltips appear inline throughout the text)

---

## How to use this resource as a researcher

### Navigating the page

- Click any **phase header** (1–5) to expand it; click again to collapse.
- Within a phase, click individual **node cards** (e.g. *Validation*, *Calibration*) to read the detailed content.
- Nested **sub-cards** and expandable **method rows** (e.g. MCMC, ABC, POM) give further depth.
- Hover over any **dashed-underlined term** for an inline definition from the Glossary.
- Toggle **"Show cross-phase linkage arrows"** to visualise how calibration, validation, and the long-term plan connect across phases.


## How to contribute

All editable content lives in a single plain-text block inside `basis.html`, clearly delimited by comment lines. No build step, no dependencies.

### Editing content

Open `basis.html` and find the block between:

```
╔══ CONTENT EDITOR ══╗
```
and
```
╚══ END OF EDITABLE CONTENT ══╝
```

The syntax is line-prefixed plain text:

| Prefix | Meaning |
|--------|---------|
| `## SECTION` | Top-level section (INTRO, GLOSSARY, CHECKLIST, CONTENTION, PHASES) |
| `=== N. Title` | Phase heading |
| `--- Title` | Node card inside a phase |
| `>>> Icon Name` | Expandable sub-item row |
| `TEXT …` | Body text for a node |
| `EXAMPLE …` | Amber example box |
| `IMPORTANT …` | Red important-flag box |
| `XLINK label \| target-id` | Cross-phase arrow (forward) |
| `XLINK-BACK` / `XLINK-BOTH` | Arrow pointing back / both directions |

Multi-line values are indented with at least two spaces. Apostrophes and quotes need no escaping.

### Deploying changes

```bash
bash push.sh
```

The script commits, pulls, and pushes to both `main` and the `pages` branch.

---

## Suggesting changes (GitHub Projects)

We use a **GitHub Project board** on this repository to track contributions. Each suggestion goes into one of three columns:

| Column | Use for |
|--------|---------|
| ✍ **Text Edit Suggestions** | Typos, rewording, clarifications, missing references |
| 🟢 **Structure Change Suggestions** | New phases, node cards, sub-items, cross-links, or re-ordering |
| 🟡 **Improvement Suggestions** | New features, UX changes, accessibility, mobile layout, visual design |

**To submit a suggestion:**

1. Go to the [Projects tab](https://github.com/MartaWenta/prediction_webpage/projects) of this repository.
2. Open the board.
3. Click **+ Add item** in the relevant column.
4. Write a short title; optionally link to a GitHub Issue for longer discussion.

There are no strict templates — a sentence describing what to change and why is enough.

---

## Repository structure

```
prediction_webpage/
├── basis.html   # the entire resource: content block + renderer + styles
├── push.sh      # one-command deploy script
└── README.md    # this file
```

Everything is self-contained in `basis.html`. There are no external dependencies beyond two Google Fonts loaded at runtime.

---

