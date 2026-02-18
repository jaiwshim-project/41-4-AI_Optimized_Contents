import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s/g, '');
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  }
  return createClient(url, serviceKey);
}

export async function GET() {
  try {
    const supabase = getServiceClient();
    const [qRes, rRes] = await Promise.all([
      supabase.from('questions').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(100),
    ]);

    return NextResponse.json({
      questions: qRes.data || [],
      reviews: rRes.data || [],
    });
  } catch {
    return NextResponse.json({ error: '데이터 조회에 실패했습니다.' }, { status: 500 });
  }
}
