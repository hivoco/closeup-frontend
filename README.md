# Closeup Love Tunes

Campaign-ended landing page for Closeup Love Tunes by Hindustan Unilever (HUL).

All routes redirect to `/campaign-ends`, which displays a Lottie animation with a thank-you message.

**Live:** https://closeuplovetunes.in

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI | React, TypeScript |
| Styling | Tailwind CSS 4, CSS Variables |
| Font | Geologica (Google Fonts via `next/font`) |
| Animations | Lottie (`lottie-react`), CSS transitions |
| Icons | `lucide-react` |
| Analytics | Google Tag Manager (`@next/third-parties`) |

---

## Getting Started

```bash
npm install
npm run dev       # localhost:3000
npm run build
npm run start     # localhost:8101
```

---

## Directory Structure

```
closeup-frontend/
├── app/
│   ├── layout.tsx              # Root layout (font, metadata, GTM)
│   ├── globals.css             # Tailwind imports, CSS variables
│   ├── force-redirect.tsx      # Redirects all routes to /campaign-ends
│   └── campaign-ends/
│       └── page.tsx            # Campaign ended page
├── public/
│   ├── closeup/thanks-logo.png # Brand logo
│   ├── og/red-logo.png         # OpenGraph image
│   ├── thank-u.png             # Thank you graphic
│   └── thanks-json-*.json      # Lottie animations (mobile/tablet/desktop)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```
