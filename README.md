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

> **If you ran an earlier version of `schema.sql`:** it created tables in `public` (`profiles`, `invitations`, `rsvps`,
> `invitation_views`), a function `record_view`/`handle_new_user`, and a trigger `on_auth_user_created` on `auth.users`.
> Check the trigger is yours to remove before dropping it, and check any `public.profiles` you already had wasn't given
> the policy named "profile self".

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
- Payments: the pricing section is marketing copy only — no billing is wired up.
- Landing-page testimonials and prices are placeholders.
- Views are counted once per browser session and never for the invitation's owner.
- `Messenger` desktop sharing needs `VITE_FB_APP_ID`; otherwise it copies the link.
