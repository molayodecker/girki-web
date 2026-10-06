# Girki Web

TanStack Start app for [Girki](https://girki.com): private chefs in Ghana.

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production readiness

### Verify locally

```bash
pnpm typecheck
pnpm build
pnpm start          # Node server from .output/
# or
pnpm preview        # Vite preview
```

Health check (after deploy): `GET /api/health` → `{ "ok": true }`.

### Vercel

1. Connect the repo; framework is **TanStack Start** (`vercel.json`).
2. Set **Production** environment variables from `.env.example` (minimum):
   - `DATABASE_URL`, `CHEF_SESSION_SECRET`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - `APP_URL` (canonical HTTPS origin)
   - `VITE_MEDIA_CDN` (R2 / CDN URL for images)
   - `SHOWCASE_ONLY_CHEFS` / `VITE_SHOWCASE_ONLY_CHEFS` until live booking is on
   - Integrations as needed: `RESEND_API_KEY`, `MAIL_FROM`, Twilio, Sumsub, Google OAuth for Supabase
3. Update `public/sitemap.xml` and `public/robots.txt` **Sitemap** URL to match `APP_URL`.
4. Deploy; CI runs **typecheck + build** on PRs and `main` (`.github/workflows/ci.yml`).

### Media (Cloudflare R2)

Marketing images, videos, chef photos, and app screenshots are served from the public **`girki-media`** bucket (shared with the girki mobile app). The app resolves URLs via `VITE_MEDIA_CDN` (see `src/lib/media.ts`).

```bash
pnpm media:sync    # stage mobile + web assets into ./media
pnpm media:upload  # wrangler r2 object put girki-media/... (requires wrangler login)
```

Set **`GIRKI_MOBILE_ROOT`** if the mobile app is not at `../girki/girki`. Large files under `public/images/marketing`, `public/videos`, etc. are gitignored once uploaded; keep sources locally or in R2 only.

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- React 19, Tailwind CSS v4, Supabase Auth, Postgres
