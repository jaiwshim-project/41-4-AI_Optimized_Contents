import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s/g, '');
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  }
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    // 로그인 사용자 확인
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 관리자 여부 확인
    const { data: planData } = await getAdminClient()
      .from('user_plans')
      .select('plan')
      .eq('user_id', user.id)
      .maybeSingle();

    if (planData?.plan !== 'admin') {
      return NextResponse.json({ error: '관리자만 답변할 수 있습니다.' }, { status: 403 });
    }

    const { questionId, answer } = await request.json();
    if (!questionId || !answer?.trim()) {
      return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    const { error } = await adminClient
      .from('questions')
      .update({ answer: answer.trim(), answered_at: new Date().toISOString() })
      .eq('id', questionId);

    if (error) {
      return NextResponse.json({ error: '답변 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
