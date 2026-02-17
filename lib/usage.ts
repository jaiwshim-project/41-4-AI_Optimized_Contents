import { createClient } from './supabase-client';

export type PlanType = 'admin' | 'free' | 'pro' | 'max';
export type FeatureType = 'analyze' | 'generate' | 'keyword' | 'series';

const PLAN_LIMITS: Record<PlanType, number> = {
  admin: Infinity,
  free: 3,
  pro: 15,
  max: 50,
};

export const FEATURE_LABELS: Record<FeatureType, string> = {
  analyze: '콘텐츠 분석',
  generate: '콘텐츠 생성',
  keyword: '키워드 분석',
  series: '시리즈 기획',
};

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function getUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');
  return user.id;
}

export async function getUserPlan(): Promise<PlanType> {
  const userId = await getUserId();
  const supabase = createClient();
  const { data } = await supabase
    .from('user_plans')
    .select('plan, expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) return 'free';

  // 관리자는 만료 없음
  if (data.plan === 'admin') return 'admin';

  // 만료일 체크
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return 'free';
  }

  return data.plan as PlanType;
}

export async function getUsageCount(feature: FeatureType): Promise<number> {
  const userId = await getUserId();
  const month = getCurrentMonth();
  const supabase = createClient();

  const { data } = await supabase
    .from('usage_counts')
    .select('count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('month', month)
    .maybeSingle();

  return data?.count || 0;
}

export async function canUseFeature(feature: FeatureType): Promise<{ allowed: boolean; current: number; limit: number; plan: PlanType }> {
  const plan = await getUserPlan();
  const current = await getUsageCount(feature);
  const limit = PLAN_LIMITS[plan];

  return {
    allowed: current < limit,
    current,
    limit,
    plan,
  };
}

export async function incrementUsage(feature: FeatureType): Promise<void> {
  const userId = await getUserId();
  const month = getCurrentMonth();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('usage_counts')
    .select('id, count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('month', month)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('usage_counts')
      .update({ count: existing.count + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('usage_counts')
      .insert({ user_id: userId, feature, month, count: 1 });
  }
}

export async function getUsageSummary(): Promise<{ feature: FeatureType; label: string; current: number; limit: number }[]> {
  const plan = await getUserPlan();
  const limit = plan === 'admin' ? 999999 : PLAN_LIMITS[plan];
  const features: FeatureType[] = ['analyze', 'generate', 'keyword', 'series'];

  const results = await Promise.all(
    features.map(async (feature) => ({
      feature,
      label: FEATURE_LABELS[feature],
      current: await getUsageCount(feature),
      limit,
    }))
  );

  return results;
}

export function getPlanLimit(plan: PlanType): number {
  return PLAN_LIMITS[plan];
}
