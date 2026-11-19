# InviteMe — Digital Occasion Invitations

React + Vite + Tailwind + Supabase. Create, customise, publish and share digital invitations; collect RSVPs; track views.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

With **no `.env`** the app runs in **demo mode**: accounts, invitations, RSVPs and images are stored in the browser's
localStorage (a published link only works in the same browser). This is for trying the product; it is not secure storage.

## Connect Supabase (production mode)

InviteMe is built to **share an existing Supabase project without touching your other tables.**
Everything it owns lives in its own `inviteme` schema and `inviteme-media` bucket.

1. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It only creates:
   the `inviteme` schema, the `inviteme-media` bucket, and `inviteme_*` policies on `storage.objects`
   (each scoped to that bucket). It does **not** touch `public`, add triggers to `auth.users`, or create extensions.
2. **Project Settings → API → Exposed schemas → add `inviteme`.** Keep the schemas already listed — add, don't replace.
   (Without this the app shows a message telling you to do it.)
3. `cp .env.example .env` and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`.
4. Auth → URL configuration: add `<SITE_URL>/reset-password` and `<SITE_URL>/dashboard` as redirect URLs.
5. Optional RSVP emails: deploy `supabase/functions/send-rsvp-email` (needs `RESEND_API_KEY`, `FROM_EMAIL`).

Users sign in through the project's shared `auth.users`, so someone who already has an account in your other app can use
InviteMe with the same login. InviteMe only reads and writes its own rows (enforced by row level security).

To remove it again: [`supabase/uninstall.sql`](supabase/uninstall.sql).

> **Updating an existing install:** `schema.sql` is safe to run again. Re-run it after pulling a version that adds tables —
> for example **Favorites** and **My templates** (saved designs) need `inviteme.favorite_templates` and
> `inviteme.saved_templates`. Until then the rest of the app works and those two features show a "run schema.sql" message.

> **If you ran an earlier version of `schema.sql`:** it created tables in `public` (`profiles`, `invitations`, `rsvps`,
> `invitation_views`), a function `record_view`/`handle_new_user`, and a trigger `on_auth_user_created` on `auth.users`.
> Check the trigger is yours to remove before dropping it, and check any `public.profiles` you already had wasn't given
> the policy named "profile self".

## Deploy to GitHub Pages

A workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds and publishes the site on every push to `main`.
It will be served at `https://<owner>.github.io/<repo>/` (for this repo: `https://micach02.github.io/invite-me/`).

**One-time setup**
1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. *(Optional, for a live backend)* Repo → **Settings → Secrets and variables → Actions → Variables** → add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The anon key is public by design (it ships in the bundle);
   row level security protects the data. **If you skip this, the site deploys in browser-storage demo mode**
   — fine for a showcase, but accounts and published links then exist only in each visitor's own browser.
3. If you use Supabase: Authentication → URL Configuration → set **Site URL** to the Pages URL and add
   `https://<owner>.github.io/<repo>/reset-password` and `.../dashboard` to the redirect URLs.

**How it handles a sub-path and refreshes**
- The workflow builds with `VITE_BASE=/<repo>/`, which sets Vite's `base` and the router `basename`;
  in-app links use `appPath()` / `siteUrl()` so share URLs, "Preview as guest" and the footer link include it.
- GitHub Pages cannot rewrite URLs, so the build also emits `404.html` (a copy of `index.html`). Opening or
  refreshing a deep link such as `/<repo>/templates?page=2` is answered with that file and the router takes over.
  (Pages sends it with a 404 status — fine for people, but search engines and link-preview crawlers will treat
  deep links as not found. See the Open Graph note below.)
- Local development is unchanged (`base` defaults to `/`).

> Your local `.env` is git-ignored and is **not** used by the workflow — CI only sees the repository variables above.
> Running tests or demos while `.env` has Supabase keys talks to the real project; blank
> `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in the shell to force demo mode.

## Architecture

```
src/
  services/      local.js ⇄ remote.js behind one API (auth, invitations, rsvps, storage) — switched by env vars
  data/          templates.js (design tokens only), defaultConfig.js (JSON schema + sample copy), constants.js
  components/
    invitation/  InvitationRenderer (ONE renderer for every template), Cover layouts, Decor SVGs, RSVP form, opening animation
    editor/      EditorPanel (left) · PreviewFrame (centre) · SettingsPanel (right) · Publish/Share modals
  hooks/         useConfig (undo/redo), useAutosave, useDocumentMeta
  pages/         Landing, Templates, Login/Register/Forgot/Reset, Dashboard, Editor, PublicInvitation, Analytics, Profile
```

**One JSON config, many templates.** An invitation is `{ event, host, venue, images, theme, sections, page, meta }`.
A template is just a `theme` preset (fonts, colours, cover layout, decoration). Switching templates swaps `theme` and keeps
all content. There is no per-template editor.

## Known limitations / next steps

- **Link-preview crawlers (Facebook, WhatsApp, Messenger) don't execute JavaScript**, so the Open Graph tags set by
  `useDocumentMeta` only help browsers. For rich previews, serve `/invitation/:slug` through a prerender step or an edge
  function that injects OG tags from the `invitations` row. Not included.
- Pricing: hidden while every feature is free. Flip `SHOW_PRICING` in `src/config/site.js` to bring back the pricing section
  and its nav/footer links. It is marketing copy only — no billing is wired up and nothing enforces plan limits.
- Landing-page testimonials and prices are placeholders.
- Views are counted once per browser session and never for the invitation's owner.
- `Messenger` desktop sharing needs `VITE_FB_APP_ID`; otherwise it copies the link.
