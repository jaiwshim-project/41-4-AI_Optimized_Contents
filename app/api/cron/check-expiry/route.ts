import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  // Vercel Cron 인증
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!.replace(/\s/g, '')
    );

    const now = new Date().toISOString();

    // 만료된 유료 사용자 조회
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('user_plans')
      .select('user_id, plan, expires_at')
      .in('plan', ['pro', 'max'])
      .lt('expires_at', now);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({ message: '만료된 사용자 없음', downgraded: 0 });
    }

    // 일괄 다운그레이드 (free로 변경, 이전 등급 보존)
    const userIds = expiredUsers.map(u => u.user_id);

    // 각 사용자별로 previous_plan 설정 후 다운그레이드
    for (const user of expiredUsers) {
      const { error: updateError } = await supabase
        .from('user_plans')
        .update({ plan: 'free', previous_plan: user.plan, expires_at: null })
        .eq('user_id', user.user_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // 히스토리 기록
      await supabase.from('plan_history').insert({
        user_id: user.user_id,
        old_plan: user.plan,
        new_plan: 'free',
        changed_at: new Date().toISOString(),
        changed_by: 'system',
      });
    }

    return NextResponse.json({
      message: `${userIds.length}명 다운그레이드 완료`,
      downgraded: userIds.length,
      users: expiredUsers.map(u => ({ user_id: u.user_id, was_plan: u.plan })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '서버 오류' },
      { status: 500 }
    );
  }
}
