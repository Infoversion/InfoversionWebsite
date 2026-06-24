-- contact_submissions: public INSERT via anon key, no public SELECT
create table if not exists contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  service     text not null,
  message     text not null,
  status      text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at  timestamptz not null default now()
);

-- replies: no public access at all
create table if not exists replies (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid not null references contact_submissions(id) on delete cascade,
  body            text not null,
  sent_at         timestamptz not null default now()
);

-- RLS
alter table contact_submissions enable row level security;
alter table replies enable row level security;

-- Anyone can insert (contact form via anon key in server action — but we use service role so this is belt-and-suspenders)
create policy "public can insert contact submissions"
  on contact_submissions for insert
  to anon
  with check (true);

-- No public reads on either table
-- Admin operations use service role key which bypasses RLS entirely
