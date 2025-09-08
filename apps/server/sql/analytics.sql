-- Analytics tables for page views
-- Apply in your Supabase/Postgres project

create extension if not exists pgcrypto; -- for gen_random_uuid

create table if not exists public.analytics_pageviews (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  path text not null,
  title text,
  referrer text,
  ip text,
  user_id text,
  user_agent text
);

-- Indexes for common queries
create index if not exists idx_analytics_pageviews_occurred_at on public.analytics_pageviews (occurred_at desc);
create index if not exists idx_analytics_pageviews_path on public.analytics_pageviews (path);
create index if not exists idx_analytics_pageviews_user_id on public.analytics_pageviews (user_id);

