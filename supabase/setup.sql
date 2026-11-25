-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again; it won't duplicate anything.

-- ---------------------------------------------------------------------------
-- 1. Who counts as the admin
-- ---------------------------------------------------------------------------
-- A one-row list of user ids allowed to upload/delete. Nobody can read or
-- write this table through the API (RLS on, no policies); only the function
-- below can look at it.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 2. The list of portfolio images
-- ---------------------------------------------------------------------------
create table if not exists public.images (
  id          uuid primary key default gen_random_uuid(),
  full_path   text not null,          -- path in the storage bucket, ~2400px
  thumb_path  text not null,          -- path in the storage bucket, ~800px
  width       integer not null check (width > 0),
  height      integer not null check (height > 0),
  created_at  timestamptz not null default now()
);
create index if not exists images_created_at_idx on public.images (created_at desc);
alter table public.images enable row level security;

drop policy if exists "Anyone can view images" on public.images;
create policy "Anyone can view images"
  on public.images for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can add images" on public.images;
create policy "Admin can add images"
  on public.images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admin can delete images" on public.images;
create policy "Admin can delete images"
  on public.images for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. The storage bucket for the image files
-- ---------------------------------------------------------------------------
-- Public = files can be viewed by URL. Uploads are limited to JPEGs <= 5 MB
-- (the app shrinks photos to well under that before uploading).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view portfolio files" on storage.objects;
create policy "Anyone can view portfolio files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "Admin can upload portfolio files" on storage.objects;
create policy "Admin can upload portfolio files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Admin can delete portfolio files" on storage.objects;
create policy "Admin can delete portfolio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Make your friend the admin  (do this AFTER creating his user)
-- ---------------------------------------------------------------------------
-- Authentication -> Users -> Add user -> enter his email + a strong password.
-- Then replace the email below and run just this statement:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'his-email@example.com'
-- on conflict do nothing;
