-- =====================================================================================
-- InviteMe — ISOLATED install. Safe to run in a Supabase project that already has data.
--
-- What this script touches (and nothing else):
--   • a NEW schema            inviteme            (all tables, the view counter function)
--   • a NEW storage bucket    inviteme-media
--   • NEW policies on         storage.objects     (every one named "inviteme_*" and scoped to that bucket)
--
-- What it deliberately does NOT do:
--   • create, alter or add policies to anything in the `public` schema
--   • add triggers to auth.users or any other shared table
--   • create extensions or change roles, auth settings or existing buckets
--
-- Existing apps keep working exactly as before. Users share the project's auth.users, but InviteMe only
-- ever reads/writes its own rows, enforced by row level security.
--
-- AFTER RUNNING: Project Settings → API → "Exposed schemas" → ADD `inviteme` (keep what is already there).
-- To remove everything again: run supabase/uninstall.sql.
-- =====================================================================================

begin;

create schema if not exists inviteme;
comment on schema inviteme is 'InviteMe digital invitations. Remove with: drop schema inviteme cascade;';

-- ---------------------------------------------------------------------------- tables
create table if not exists inviteme.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists inviteme.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text unique,
  title text not null default 'Untitled invitation',
  occasion text not null default 'wedding',
  template_id text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  event_date timestamptz,
  thumbnail_url text,
  view_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);
create index if not exists invitations_user_idx on inviteme.invitations (user_id);
create index if not exists invitations_slug_idx on inviteme.invitations (slug);

create table if not exists inviteme.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references inviteme.invitations(id) on delete cascade,
  guest_name text not null,
  email text,
  phone text,
  attending text not null check (attending in ('yes', 'no', 'maybe')),
  guest_count integer not null default 1,
  message text,
  meal_preference text,
  created_at timestamptz default now()
);
create index if not exists rsvps_inv_idx on inviteme.rsvps (invitation_id);

create table if not exists inviteme.invitation_views (
  id bigserial primary key,
  invitation_id uuid not null references inviteme.invitations(id) on delete cascade,
  viewed_at timestamptz default now()
);
create index if not exists views_inv_idx on inviteme.invitation_views (invitation_id);

-- ---------------------------------------------------------------------------- row level security
alter table inviteme.profiles enable row level security;
alter table inviteme.invitations enable row level security;
alter table inviteme.rsvps enable row level security;
alter table inviteme.invitation_views enable row level security;

-- (drop + create keeps this script re-runnable; these only ever touch our own tables)
drop policy if exists "profile self" on inviteme.profiles;
create policy "profile self" on inviteme.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "owner manages invitations" on inviteme.invitations;
create policy "owner manages invitations" on inviteme.invitations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "public reads published" on inviteme.invitations;
create policy "public reads published" on inviteme.invitations for select
  using (status = 'published');

drop policy if exists "owner reads rsvps" on inviteme.rsvps;
create policy "owner reads rsvps" on inviteme.rsvps for select
  using (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
drop policy if exists "owner updates rsvps" on inviteme.rsvps;
create policy "owner updates rsvps" on inviteme.rsvps for update
  using (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
drop policy if exists "owner deletes rsvps" on inviteme.rsvps;
create policy "owner deletes rsvps" on inviteme.rsvps for delete
  using (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
drop policy if exists "owner adds guests manually" on inviteme.rsvps;
create policy "owner adds guests manually" on inviteme.rsvps for insert
  with check (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
drop policy if exists "guests submit rsvp" on inviteme.rsvps;
create policy "guests submit rsvp" on inviteme.rsvps for insert
  with check (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.status = 'published'));

drop policy if exists "owner reads views" on inviteme.invitation_views;
create policy "owner reads views" on inviteme.invitation_views for select
  using (exists (select 1 from inviteme.invitations i where i.id = invitation_id and i.user_id = auth.uid()));

-- ---------------------------------------------------------------------------- view counter
-- SECURITY DEFINER so anonymous guests can bump the counter without any write access to the tables.
-- It only counts invitations that are published.
create or replace function inviteme.record_view(inv_id uuid) returns void
language plpgsql security definer set search_path = inviteme, pg_temp as $$
begin
  if exists (select 1 from inviteme.invitations where id = inv_id and status = 'published') then
    insert into inviteme.invitation_views (invitation_id) values (inv_id);
    update inviteme.invitations set view_count = view_count + 1 where id = inv_id;
  end if;
end $$;
revoke all on function inviteme.record_view(uuid) from public;
grant execute on function inviteme.record_view(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------- API privileges
-- A custom schema gets no grants by default. Give each API role the minimum; RLS does the row filtering.
grant usage on schema inviteme to anon, authenticated, service_role;

grant select on inviteme.invitations to anon;             -- published invitations only (policy)
grant insert on inviteme.rsvps to anon;                   -- RSVPs to published invitations only (policy)

grant select, insert, update, delete on inviteme.profiles, inviteme.invitations, inviteme.rsvps to authenticated;
grant select on inviteme.invitation_views to authenticated;

grant all on all tables in schema inviteme to service_role;   -- used by the optional RSVP-email Edge Function
grant all on all sequences in schema inviteme to service_role;

-- ---------------------------------------------------------------------------- media bucket
-- A distinct bucket name, so we never adopt (and add policies to) a bucket someone else created.
insert into storage.buckets (id, name, public) values ('inviteme-media', 'inviteme-media', true)
on conflict (id) do nothing;

-- Policies on storage.objects are additive and every one below is scoped to OUR bucket,
-- so other buckets' access rules are unchanged. Uploads must go into the user's own folder (<uid>/…).
drop policy if exists "inviteme_upload_own" on storage.objects;
create policy "inviteme_upload_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'inviteme-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "inviteme_read_own" on storage.objects;
create policy "inviteme_read_own" on storage.objects for select to authenticated
  using (bucket_id = 'inviteme-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "inviteme_delete_own" on storage.objects;
create policy "inviteme_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'inviteme-media' and (storage.foldername(name))[1] = auth.uid()::text);

commit;
