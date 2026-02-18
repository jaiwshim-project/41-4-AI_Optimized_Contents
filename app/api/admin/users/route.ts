import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = '96331425';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s/g, '');
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
    const { data: monthlyUsage } = await supabase
      .from('usage_counts')
      .select('user_id, feature, count')
      .eq('month', month);

    // usage_counts 전체 (누적)
    const { data: allUsage } = await supabase
      .from('usage_counts')
      .select('user_id, feature, count');

    // 데이터 조합
    const planMap = new Map((plans || []).map(p => [p.user_id, p]));

    const monthlyMap = new Map<string, Record<string, number>>();
    (monthlyUsage || []).forEach(u => {
      if (!monthlyMap.has(u.user_id)) monthlyMap.set(u.user_id, {});
      monthlyMap.get(u.user_id)![u.feature] = u.count;
    });

    const totalMap = new Map<string, Record<string, number>>();
    (allUsage || []).forEach(u => {
      if (!totalMap.has(u.user_id)) totalMap.set(u.user_id, {});
      const prev = totalMap.get(u.user_id)![u.feature] || 0;
      totalMap.get(u.user_id)![u.feature] = prev + u.count;
    });

    const result = users.map(user => {
      const planData = planMap.get(user.id);
      const monthly = monthlyMap.get(user.id) || {};
      const total = totalMap.get(user.id) || {};
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.user_name || user.user_metadata?.preferred_username || '',
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        plan: planData?.plan || 'free',
        plan_expires_at: planData?.expires_at || null,
        usage: {
          analyze: monthly['analyze'] || 0,
          generate: monthly['generate'] || 0,
          keyword: monthly['keyword'] || 0,
          series: monthly['series'] || 0,
        },
        totalUsage: {
          analyze: total['analyze'] || 0,
          generate: total['generate'] || 0,
          keyword: total['keyword'] || 0,
          series: total['series'] || 0,
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

// POST: 회원 등급 변경 또는 이름 수정
export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: '관리자 인증 실패' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, plan, name } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 이름 수정
    if (name !== undefined) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: name },
      });
      if (updateError) throw updateError;
    }

    // 등급 변경
    if (plan) {
      if (!['admin', 'free', 'pro', 'max'].includes(plan)) {
        return NextResponse.json({ error: '유효하지 않은 플랜입니다.' }, { status: 400 });
      }

      const { error } = await supabase
        .from('user_plans')
        .upsert(
          { user_id: userId, plan, created_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '서버 오류' },
      { status: 500 }
    );
  }
}
