# kenechukwu.dev

Personal portfolio website built with React, TypeScript, Vite and TailwindCSS.

## Stack

- React 19
- TypeScript
- Vite
- TailwindCSS v4
- Markdown posts compiled at build time with MDX (`@mdx-js/rollup`)
- Vitest and Testing Library

## Pages

- `/` — Home
- `/work` — Experience
- `/projects` — Projects
- `/about` — About
- `/writing` — Writing, and `/writing/:slug` for each post

Light and dark themes follow the system setting until a visitor picks one with the toggle in the top-right corner.

## Writing a post

Add a Markdown file to `src/content/writing/`. The file name becomes the URL (`my-post.md` → `/writing/my-post`), so use lowercase letters, numbers and hyphens.

```md
---
title: 'My post'
date: '2026-10-21'
description: 'One sentence shown on the writing list.'
---

## First section
```

The writing link and pages only appear while there is at least one post. Code blocks are highlighted at build time, so no highlighter ships to the browser.

## Running locally

```bash
npm install
npm run dev
```

Other scripts: `npm test`, `npm run lint`, `npm run build`, `npm run coverage`.

## Deployment

Deployed on Vercel at [kenechukwu.dev](https://kenechukwu.dev)

![CI](https://github.com/kxnxchukwu/kenechukwu.dev/actions/workflows/ci.yml/badge.svg)
