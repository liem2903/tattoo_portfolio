# Tattoo Portfolio

A simple portfolio site for a tattoo artist: a header with his name and clickable contacts, then one long scroll of tattoo photos. He logs in at an admin page to upload and delete images.

## Stack
- Vite + React + TypeScript, plain CSS modules (no Tailwind, no UI kit).
- Supabase (auth, storage, database). No custom server code. Setup lives in `supabase/setup.sql`.
- Hosted on Railway: `npm start` runs `serve -s dist` (SPA fallback for `/admin`). `VITE_*` env vars are build-time.
- Libraries: `react-router-dom`, `react-masonry-css` (admin grid), `yet-another-react-lightbox` + Zoom (viewer), `qrcode`.

## Product decisions (settled with the user)
- `/` public page ("Label" layout, chosen after comparing sticky/frame/grid): intro header (name, subtitle, contacts) that scrolls away; left-aligned on phones, centred on desktop to share an axis with the images. Then a scroll-snap feed (`Feed.tsx`): one piece per screen, each with a gallery placard underneath showing month/year (no piece numbers). Tap to open the viewer.
- `/admin` uses the masonry grid (`Gallery.tsx`) because managing many images is easier in a grid.
- `/admin` login-gated, not linked from the public site, lazy-loaded.
- One admin account, created by hand. Public sign-ups disabled. Admin = row in `public.admins`; `public.is_admin()` gates every write.
- Security is enforced by Supabase RLS/storage policies, never by hiding UI.
- Admin can upload (multiple) and delete (with confirm). Newest first. No captions/reordering yet.
- Uploads are resized in the browser: ~2400px full + ~800px thumbnail, JPEG. Grid shows thumbs; viewer shows full. (Supabase image transforms are paid, so thumbnails are made client-side.)
- Contacts (Instagram, phone, email) live in `src/config.ts` as a list; the user edits that file to change them.
- Admin has a QR code (PNG + SVG download) built from `window.location.origin`.
- Link preview: static `public/preview.png` + meta tags in `index.html`.

## Architecture (layered, keep it this way)
- `src/config.ts`: artist details and contacts. No logic.
- `src/lib/`: infrastructure (`supabase.ts` client, `resizeImage.ts` pure canvas helper).
- `src/services/`: the only place that calls Supabase (`imageService`, `authService`).
- `src/hooks/`: React state around services (`useImages`, `useSession`, `useAdminActions`).
- `src/components/`: presentational pieces. No direct Supabase calls.
- `src/pages/`: compose components and hooks per route.

## Verify changes
- `npm run build` (includes `tsc -b`) and `npm run lint` must pass.

## Design rules: do not make it look AI-generated

The work is the photos. The site should feel like it was made by a person with taste, closer to a print zine or a gallery wall than a SaaS landing page.

Avoid these common AI/template design tells:
- Purple/indigo/violet gradients, gradient text, or "aurora" or blurred blob backgrounds.
- Glassmorphism (frosted translucent cards with backdrop blur).
- Everything in rounded cards with soft drop shadows; `rounded-2xl` on every element.
- Emoji or generic icon-library icons used as decoration (sparkles, rockets, etc.).
- Hero sections with a big centered headline, subheadline, and two CTA buttons.
- Marketing copy: "Elevate", "Unleash", "Crafted with passion", "Your journey starts here", taglines nobody asked for.
- Inter/system-sans for everything with no typographic decision behind it.
- Fade-up-on-scroll animations on every element, hover-scale on every image, gratuitous motion.
- Centered-everything layouts with identical spacing and no visual hierarchy.
- Pill-shaped badges, "Featured" labels, testimonial carousels, stat counters.
- Dark mode with neon accent glows.
- Footers full of placeholder links.

Tone: professional and understated, like a gallery or studio site. The user rejected a heavy condensed all-caps display face + monospace as "comicky". Current type: EB Garamond (name/headings, normal case) + Hanken Grotesk (everything else), sentence case, quiet hairline rules.

Do instead:
- Let the images dominate: large, edge-to-edge or nearly, minimal gaps, no frames or shadows.
- Make a deliberate type choice (one distinctive face for his name, plain text otherwise) and use a restrained palette (near-black, off-white, maybe one accent).
- Use plain text links for contacts rather than chunky buttons. They still need comfortable tap targets on mobile.
- Keep copy minimal: his name, studio/city, contacts. Nothing else.
- Use sharp or barely-rounded corners and real hierarchy through size and weight, not boxes.
- Keep motion near zero; if any, subtle and purposeful.
- Check each choice by asking whether it would appear in a generic template. If yes, reconsider.
