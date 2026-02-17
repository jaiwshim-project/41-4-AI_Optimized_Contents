import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = '96331425';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  }
  return createClient(url, serviceKey);
}

// GET: 회원 목록 조회
export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: '관리자 인증 실패' }, { status: 403 });
  }

  try {
    const supabase = getAdminClient();

    // auth.users 목록 조회
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (usersError) throw usersError;

    // user_plans 목록 조회
    const { data: plans } = await supabase
      .from('user_plans')
      .select('user_id, plan, created_at, expires_at');

    // usage_counts 이번 달
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { data: usageCounts } = await supabase
      .from('usage_counts')
      .select('user_id, feature, count')
      .eq('month', month);

    // 데이터 조합
    const planMap = new Map((plans || []).map(p => [p.user_id, p]));
    const usageMap = new Map<string, Record<string, number>>();
    (usageCounts || []).forEach(u => {
      if (!usageMap.has(u.user_id)) usageMap.set(u.user_id, {});
      usageMap.get(u.user_id)![u.feature] = u.count;
    });

    const result = users.map(user => {
      const planData = planMap.get(user.id);
      const usage = usageMap.get(user.id) || {};
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        plan: planData?.plan || 'free',
        plan_expires_at: planData?.expires_at || null,
        usage: {
          analyze: usage['analyze'] || 0,
          generate: usage['generate'] || 0,
          keyword: usage['keyword'] || 0,
          series: usage['series'] || 0,
        },
      };
    });

    return NextResponse.json({ users: result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '서버 오류' },
      { status: 500 }
    );
  }
}

// POST: 회원 등급 변경
export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: '관리자 인증 실패' }, { status: 403 });
  }

  try {
    const { userId, plan } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: 'userId와 plan이 필요합니다.' }, { status: 400 });
    }

    if (!['admin', 'free', 'pro', 'max'].includes(plan)) {
      return NextResponse.json({ error: '유효하지 않은 플랜입니다.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // upsert: 있으면 업데이트, 없으면 생성
    const { error } = await supabase
      .from('user_plans')
      .upsert(
        { user_id: userId, plan, created_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '서버 오류' },
      { status: 500 }
    );
  }
}
