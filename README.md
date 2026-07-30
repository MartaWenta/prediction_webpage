# Orientation for Environmental Predictions

A community-authored, interactive web resource for researchers and practitioners designing, executing, and communicating rigorous quantitative predictions in ecology and environmental science.

**Live site:** https://martawenta.github.io/prediction_webpage/basis.html

---

## How to contribute

Most edits go in **`webpage.html`** (syntax guide in the HTML comment; content in the `<script id="page-content">` block from `## INTRO`). Detail pages live in **`details/`**.

1. **Fork** the repo on GitHub (or clone if you are a collaborator).
2. **Create a branch** from `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b small-description # could also be your name
   ```
3. **Edit**, commit, and push your branch:
   ```bash
   git add webpage.html   # and/or details/, scripts/, etc.
   git commit -m "Brief summary of what changed and why"
   git push -u origin feature/short-description
   ```
4. **Open a Pull Request** to `main` on GitHub. Describe the change in a few sentences.
5. After review and merge, the site is updated from `main` (maintainers use `push.sh` to publish to GitHub Pages).

---

## Repository structure

```
prediction_webpage/
├── basis.html              # page shell and scripts
├── webpage.html            # editor guide + all page content
├── details/                # "More details" sub-pages
├── scripts/                # parser, renderer, interactivity
├── push.sh                 # one-command deploy script
└── README.md               # this file
```
