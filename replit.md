# شمل - Portfolio Website

A modern, responsive, minimalist Arabic RTL portfolio website for "شمل".

## Run & Operate

- `pnpm --filter @workspace/shaml run dev` — run the portfolio frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- Fonts: Reem Kufi (headings), Tajawal (body) — Google Fonts Arabic
- RTL: Full Arabic Right-to-Left support via `dir="rtl"` on html element
- Primary accent color: hsl(8, 61%, 41%) — brownish-red derived from logo

## Where things live

- Portfolio frontend: `artifacts/shaml/`
- Logo asset: `artifacts/shaml/public/logo.png`
- Theme/CSS: `artifacts/shaml/src/index.css`
- Main component: `artifacts/shaml/src/App.tsx`
- Original logo source: `attached_assets/image_1779143394052.png`

## Architecture decisions

- Presentation-first app — no backend needed, all static
- RTL direction set at the `<html dir="rtl">` level for full browser support
- Logo image served from `public/` directory for direct URL access
- Reem Kufi chosen as the closest available Google Fonts alternative to "Zaatar"
- Accent color (#A63528 / hsl 8 61% 41%) extracted from the logo brownish-red

## Product

A company portfolio landing page for "شمل" featuring:
- RTL navigation with logo, hamburger menu, and Arabic nav links
- Large hero section with company name in accent color
- Company vision text
- Bottom split section with company info and 4 stat cards

## User preferences

- Full Arabic RTL support required
- Brand: "شمل", accent color from logo (brownish-red)
- Fonts: Zaatar-style (using Reem Kufi) for headings, Tajawal for body
- Minimalist, modern, responsive design

## Gotchas

- Logo is in `public/logo.png` — referenced as `/logo.png` in the app
- Always keep `dir="rtl"` on the root element
- Reem Kufi from Google Fonts is the heading font (Zaatar substitute)
