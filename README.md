# Logistics & Supply Chain

**From Understanding to Practice** is a bright, responsive educational field guide for people beginning to explore logistics and supply chain management.

## What the website contains

The site includes the complete supplied learning material across focused reading routes: field overview, product journey, foundations, skills and tools, careers, practice lab, glossary, resources, about, and FAQs.

Meaningful learning interactions include an accessible backpack journey, a non-certifying foundation checklist, a career explorer, Standard versus Express and supplier-delay calculations, and a searchable glossary. Practice figures are clearly presented as fictional learning assumptions.

## Stack

The finished site is dependency-free HTML, CSS, and JavaScript in `dist/`. The complete source copy lives in `dist/content.md`; the interface reads and presents it at runtime. This keeps the project fast, portable, and easy to deploy as a static website.

## Run locally

Node.js 18 or newer is recommended. There are no dependencies to install.

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build and checks

```bash
npm run build
```

This validates the required files, all 18 source sections, mobile styles, and JavaScript syntax. The deployable output is already in `dist/`.

## Maintain the content

Edit `dist/content.md` to change educational material. Route grouping and interactions are in `dist/app.js`; design tokens and responsive styles are in `dist/styles.css`.

## Later deployment

The production domain is `logistics.detleng.com`. `CNAME` files are included for a future GitHub Pages deployment. No publishing, GitHub push, or DNS change has been performed.
