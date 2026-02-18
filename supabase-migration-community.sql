-- 질문 테이블
CREATE TABLE IF NOT EXISTS questions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  user_name text not null,
  title text not null,
  content text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz default now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 모든 로그인 사용자가 조회 가능
CREATE POLICY "Anyone can view questions" ON questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 본인만 작성 가능
CREATE POLICY "Users can insert own questions" ON questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인만 삭제 가능
CREATE POLICY "Users can delete own questions" ON questions
  FOR DELETE USING (auth.uid() = user_id);

-- 후기 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  user_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  content text not null,
  created_at timestamptz default now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 모든 로그인 사용자가 조회 가능
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 본인만 작성 가능
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인만 삭제 가능
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);
