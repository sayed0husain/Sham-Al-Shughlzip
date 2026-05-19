# شمل - Portfolio Website

A modern, responsive, minimalist Arabic RTL portfolio website for "شمل" with Firebase backend.

## Run & Operate

- `pnpm --filter @workspace/shaml run dev` — run the portfolio frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- Backend: Firebase (Firestore, Auth, Storage)
- Fonts: Zaatar (Boharat-Zataar) for headings, Tajawal for body, Inter/Arial for numbers
- RTL: Full Arabic Right-to-Left support via `dir="rtl"` on html element
- Primary accent color: hsl(8, 61%, 41%) — brownish-red from logo

## Where things live

- Portfolio frontend: `artifacts/shaml/`
- Logo asset: `artifacts/shaml/public/logo.png`
- Font files: `artifacts/shaml/public/fonts/`
- Theme/CSS: `artifacts/shaml/src/index.css`
- Firebase config: `artifacts/shaml/src/lib/firebase.ts`
- Hooks: `artifacts/shaml/src/hooks/`
- Components: `artifacts/shaml/src/components/`
- Pages: `artifacts/shaml/src/pages/`

## Firebase Setup Required (one-time)

After deploying, you MUST enable these in Firebase Console (console.firebase.google.com):

1. **Authentication** → Sign-in method → Enable "Google"
2. **Firestore Database** → Create database (start in production mode)
   - Add these security rules:
     ```
     rules_version = '2';
     service cloud.firestore.firebase.app {
       match /databases/{database}/documents {
         match /settings/{doc} {
           allow read: if true;
           allow write: if request.auth != null && request.auth.token.email == "sayedhusain133@gmail.com";
         }
         match /projects/{doc} {
           allow read: if true;
           allow write: if request.auth != null && request.auth.token.email == "sayedhusain133@gmail.com";
         }
       }
     }
     ```
3. **Storage** → Get started (production mode)
   - Add CORS rule allowing your domain
   - Storage rules: allow admin writes, public reads

## Firebase Secrets (already set in Replit Secrets)

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## Features

- **Homepage**: Hero with Zaatar font, visitor counter (live from Firestore), stats cards
- **Sidebar**: Hamburger nav with Google login, التواصل معنا, الألعاب, المواقع
- **Admin panel** (`/admin`): Only accessible to sayedhusain133@gmail.com — manage contact info, add projects
- **Games page** (`/games`): Dynamic cards from Firestore filtered by type="لعبة"
- **Websites page** (`/websites`): Dynamic cards from Firestore filtered by type="موقع"
- **Contact page** (`/contact`): Pulls WhatsApp, Instagram, Email from Firestore
- **Footer**: Social icons (WhatsApp, Instagram, Email) pulled dynamically from Firestore

## Architecture decisions

- Presentation-first app with Firebase for dynamic content
- RTL direction set at the `<html dir="rtl">` level
- Zaatar font ONLY for Arabic text, Inter/Arial for all numbers
- Admin email hardcoded as ADMIN_EMAIL constant in firebase.ts
- Visitor counter uses sessionStorage to avoid double-counting

## User preferences

- Full Arabic RTL support required
- Brand: "شمل", accent color from logo (brownish-red)
- Fonts: Zaatar for headings/labels, Tajawal for body, clean web font for numbers
- Minimalist, modern, responsive design
- Admin: sayedhusain133@gmail.com only
