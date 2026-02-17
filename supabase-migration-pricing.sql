-- =============================================
-- 요금제 시스템 마이그레이션
-- Supabase 대시보드 SQL Editor에서 실행
-- =============================================

-- 1. 사용자 플랜 테이블
CREATE TABLE IF NOT EXISTS user_plans (
  user_id uuid references auth.users(id) primary key,
  plan text not null default 'free' check (plan in ('free', 'pro', 'max')),
  created_at timestamptz default now(),
  expires_at timestamptz
);
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own plan" ON user_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. 사용량 추적 테이블
CREATE TABLE IF NOT EXISTS usage_counts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  feature text not null check (feature in ('analyze', 'generate', 'keyword', 'series')),
  month text not null,
  count int not null default 0,
  UNIQUE (user_id, feature, month)
);
ALTER TABLE usage_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own usage" ON usage_counts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
