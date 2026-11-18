-- Removes everything supabase/schema.sql created, and only that.
-- WARNING: this permanently deletes all InviteMe invitations, RSVPs, view counts and profiles.
-- Files in the inviteme-media bucket must be removed first from the Storage UI (Supabase blocks deleting a
-- bucket that still has objects); then the last statement below removes the empty bucket.

begin;

drop policy if exists "inviteme_upload_own" on storage.objects;
drop policy if exists "inviteme_read_own" on storage.objects;
drop policy if exists "inviteme_delete_own" on storage.objects;

drop schema if exists inviteme cascade;   -- tables, policies, indexes and record_view() all live inside it

commit;

-- After emptying the bucket in the Storage UI:
-- delete from storage.buckets where id = 'inviteme-media';
--
-- Then remove `inviteme` from Project Settings → API → Exposed schemas.
