# Tattoo Portfolio

A tattoo portfolio site: a header with the artist's name and contacts, then a masonry gallery wall. Tap any piece to view it full-screen (swipe, pinch to zoom). The artist signs in at `/admin` to upload and delete work and download a QR code for the site.

- **Public site:** `https://your-site/`
- **Admin:** `https://your-site/admin` (not linked anywhere; bookmark it)

## 1. Fill in his details

Edit `src/config.ts` (name, subtitle, contacts) and the `<title>`/`og:` tags in `index.html`.
Replace `public/preview.png` (1200×630 image used in link previews) and optionally `public/favicon.svg`.

## 2. Set up Supabase (once, ~15 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste all of `supabase/setup.sql` → **Run**.
   This creates the `images` table, the `portfolio` storage bucket, and the security rules.
3. **Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up".
4. **Authentication → Users → Add user → Create new user**: his email + a strong password (tick "Auto Confirm User").
5. Back in the **SQL Editor**, make that user the admin (use his real email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'his-email@example.com'
   on conflict do nothing;
   ```
6. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

## 3. Run locally

```bash
cp .env.example .env   # paste the two values from step 2.6
npm install
npm run dev            # http://localhost:5173 and http://localhost:5173/admin
```

## 4. Deploy on Railway

1. Push this repo to GitHub.
2. In Railway: **New → GitHub Repo** → pick this repo.
3. Service **Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as `.env`).
   These are baked in at build time, so redeploy after changing them.
4. **Settings → Networking → Generate Domain** (or add a custom domain).

Railway runs `npm run build` then `npm start`, which serves `dist/` with SPA fallback so `/admin` works.
Every push to `main` redeploys.

## How security works

- Anyone can **view** images. Only the account listed in `public.admins` can **upload or delete**.
- This is enforced by Supabase (row-level security and storage policies in `supabase/setup.sql`), not by the UI.
- The anon key in the frontend is public by design; it can only do what those rules allow.
- Sign-ups are off, so no one else can create an account.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm start` | Serve `dist/` (used by Railway; respects `$PORT`) |
| `npm run lint` | Lint with oxlint |
