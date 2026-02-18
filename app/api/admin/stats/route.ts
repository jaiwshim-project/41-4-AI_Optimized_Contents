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

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: '관리자 인증 실패' }, { status: 403 });
  }

  try {
    const supabase = getAdminClient();

    // 1. 전체 사용자 수 & 플랜별
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (usersError) throw usersError;

    const { data: plans } = await supabase.from('user_plans').select('user_id, plan');
    const planMap = new Map((plans || []).map(p => [p.user_id, p.plan]));

    const planCounts = { admin: 0, free: 0, pro: 0, max: 0 };
    users.forEach(u => {
      const plan = (planMap.get(u.id) || 'free') as keyof typeof planCounts;
      if (plan in planCounts) planCounts[plan]++;
    });

    // 2. 전체 사용량 (누적)
    const { data: allUsage } = await supabase.from('usage_counts').select('feature, count, month');

    const totalByFeature: Record<string, number> = { analyze: 0, generate: 0, keyword: 0, series: 0 };
    const monthlyData: Record<string, Record<string, number>> = {};

    (allUsage || []).forEach(u => {
      totalByFeature[u.feature] = (totalByFeature[u.feature] || 0) + u.count;

      if (!monthlyData[u.month]) {
        monthlyData[u.month] = { analyze: 0, generate: 0, keyword: 0, series: 0 };
      }
      monthlyData[u.month][u.feature] = (monthlyData[u.month][u.feature] || 0) + u.count;
    });

    // 3. 이번 달 사용량
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthUsage = monthlyData[currentMonth] || { analyze: 0, generate: 0, keyword: 0, series: 0 };

    // 4. 월별 추이 (최근 6개월)
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    const monthlyTrend = months.map(m => ({
      month: m,
      ...( monthlyData[m] || { analyze: 0, generate: 0, keyword: 0, series: 0 }),
      total: Object.values(monthlyData[m] || {}).reduce((a, b) => a + b, 0),
    }));

    // 5. 가입자 추이 (최근 6개월)
    const signupTrend = months.map(m => {
      const count = users.filter(u => u.created_at?.startsWith(m)).length;
      return { month: m, count };
    });

    // 6. 오늘/이번 주 활성 사용자 (최근 로그인 기준)
    const todayStr = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const activeToday = users.filter(u => u.last_sign_in_at?.startsWith(todayStr)).length;
    const activeWeek = users.filter(u => u.last_sign_in_at && u.last_sign_in_at >= weekAgo).length;

    // 7. 상위 사용자 (누적 사용량 기준 Top 10)
    const { data: userUsage } = await supabase.from('usage_counts').select('user_id, count');
    const userTotalMap = new Map<string, number>();
    (userUsage || []).forEach(u => {
      userTotalMap.set(u.user_id, (userTotalMap.get(u.user_id) || 0) + u.count);
    });
    const topUsers = [...userTotalMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, total]) => {
        const user = users.find(u => u.id === userId);
        return {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '알 수 없음',
          email: user?.email || '',
          plan: planMap.get(userId) || 'free',
          total,
        };
      });

    return NextResponse.json({
      totalUsers: users.length,
      planCounts,
      totalByFeature,
      thisMonthUsage,
      monthlyTrend,
      signupTrend,
      activeToday,
      activeWeek,
      topUsers,
      currentMonth,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '서버 오류' },
      { status: 500 }
    );
  }
}
