-- =============================================
-- Supabase 테이블 생성 SQL
-- 프로젝트: AIO/GEO 최적화 시스템
-- =============================================

-- 1. 비즈니스 프로필 테이블
create table if not exists business_profiles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  data jsonb not null,
  created_at timestamptz default now()
);

-- 2. 이력 테이블
create table if not exists history (
  id text primary key,
  type text not null check (type in ('analysis', 'generation')),
  title text not null,
  summary text,
  date text not null,
  category text,
  target_keyword text,
  analysis_result jsonb,
  original_content text,
  generate_result jsonb,
  topic text,
  tone text,
  revisions jsonb default '[]',
  created_at timestamptz default now()
);

-- 3. API 키 테이블
create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  key_type text not null unique,
  encrypted_key text not null,
  created_at timestamptz default now()
);

-- 4. 생성된 이미지 테이블
create table if not exists generated_images (
  id uuid default gen_random_uuid() primary key,
  history_id text references history(id) on delete cascade,
  image_url text not null,
  prompt text,
  created_at timestamptz default now()
);

-- RLS (Row Level Security) 비활성화 (단일 사용자 앱)
-- 필요 시 활성화하고 정책 추가
alter table business_profiles enable row level security;
alter table history enable row level security;
alter table api_keys enable row level security;
alter table generated_images enable row level security;

-- 모든 사용자에게 접근 허용 (anon key 사용)
create policy "Allow all on business_profiles" on business_profiles for all using (true) with check (true);
create policy "Allow all on history" on history for all using (true) with check (true);
create policy "Allow all on api_keys" on api_keys for all using (true) with check (true);
create policy "Allow all on generated_images" on generated_images for all using (true) with check (true);

-- Storage 버킷 생성은 Supabase 대시보드에서 수행:
-- 버킷명: generated-images (public)
