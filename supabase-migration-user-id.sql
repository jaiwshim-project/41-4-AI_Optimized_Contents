-- =============================================
-- user_id 추가 마이그레이션
-- 사용자별 데이터 격리를 위한 변경
-- Supabase 대시보드 SQL Editor에서 실행
-- =============================================

-- 1. 각 테이블에 user_id 컬럼 추가
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);
ALTER TABLE history ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);
ALTER TABLE generate_results ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);

-- 2. api_keys의 기존 unique 제약 변경 (key_type → key_type + user_id)
ALTER TABLE api_keys DROP CONSTRAINT IF EXISTS api_keys_key_type_key;
ALTER TABLE api_keys ADD CONSTRAINT api_keys_key_type_user_id_key UNIQUE (key_type, user_id);

-- 3. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Allow all on business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Allow all on history" ON history;
DROP POLICY IF EXISTS "Allow all on api_keys" ON api_keys;
DROP POLICY IF EXISTS "Allow all on generated_images" ON generated_images;
DROP POLICY IF EXISTS "Allow all on generate_results" ON generate_results;

-- 4. 사용자별 격리 RLS 정책 생성
CREATE POLICY "Users own data" ON business_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own data" ON history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own data" ON api_keys
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own images" ON generated_images
  FOR ALL USING (
    history_id IN (SELECT id FROM history WHERE user_id = auth.uid())
  ) WITH CHECK (
    history_id IN (SELECT id FROM history WHERE user_id = auth.uid())
  );

CREATE POLICY "Users own data" ON generate_results
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
