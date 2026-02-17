'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { HistoryItem } from '@/lib/types';

interface DashboardStatsProps {
  history: HistoryItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  blog: '#6366f1',
  sns_instagram: '#ec4899',
  sns_linkedin: '#0ea5e9',
  product_description: '#f59e0b',
  press_release: '#10b981',
  newsletter: '#8b5cf6',
  landing_page: '#ef4444',
  youtube_script: '#f97316',
  seo_article: '#14b8a6',
};

const CATEGORY_LABELS: Record<string, string> = {
  blog: '블로그',
  sns_instagram: '인스타그램',
  sns_linkedin: '링크드인',
  product_description: '제품 설명',
  press_release: '보도자료',
  newsletter: '뉴스레터',
  landing_page: '랜딩 페이지',
  youtube_script: '유튜브 스크립트',
  seo_article: 'SEO 아티클',
  analysis: '분석',
  generation: '생성',
};

const PIE_COLORS = ['#6366f1', '#ec4899', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#f97316'];

export default function DashboardStats({ history }: DashboardStatsProps) {
  const stats = useMemo(() => {
    // 월별 생성 수
    const monthlyMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    let totalScore = 0;
    let scoreCount = 0;
    let totalLength = 0;

    history.forEach(item => {
      // 월별
      const date = item.date?.substring(0, 7) || 'unknown';
      monthlyMap.set(date, (monthlyMap.get(date) || 0) + 1);

      // 타입별
      const type = item.type || 'unknown';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);

      // 카테고리별
      if (item.category) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      }

      // 점수
      if (item.analysisResult?.overallScore) {
        totalScore += item.analysisResult.overallScore;
        scoreCount++;
      }

      // 길이
      if (item.generateResult?.content) {
        totalLength += item.generateResult.content.length;
      } else if (item.originalContent) {
        totalLength += item.originalContent.length;
      }
    });

    const monthly = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, count]) => ({ month: month.substring(5) + '월', count }));

    const categories = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name: CATEGORY_LABELS[name] || name,
        value,
        color: CATEGORY_COLORS[name] || '#94a3b8',
      }))
      .sort((a, b) => b.value - a.value);

    const types = Array.from(typeMap.entries())
      .map(([name, value]) => ({
        name: CATEGORY_LABELS[name] || name,
        value,
      }));

    return {
      total: history.length,
      generations: typeMap.get('generation') || 0,
      analyses: typeMap.get('analysis') || 0,
      avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      avgLength: history.length > 0 ? Math.round(totalLength / history.length) : 0,
      monthly,
      categories,
      types,
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        통계를 표시하려면 콘텐츠를 생성하거나 분석하세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200">
          <p className="text-[10px] text-indigo-600 font-medium">총 콘텐츠</p>
          <p className="text-2xl font-bold text-indigo-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-[10px] text-purple-600 font-medium">생성</p>
          <p className="text-2xl font-bold text-purple-800">{stats.generations}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
          <p className="text-[10px] text-emerald-600 font-medium">분석</p>
          <p className="text-2xl font-bold text-emerald-800">{stats.analyses}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
          <p className="text-[10px] text-amber-600 font-medium">평균 AIO 점수</p>
          <p className="text-2xl font-bold text-amber-800">{stats.avgScore > 0 ? stats.avgScore : '-'}<span className="text-sm font-normal">{stats.avgScore > 0 ? '점' : ''}</span></p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 월별 생성 추이 */}
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            월별 콘텐츠 생성 추이
          </h3>
          {stats.monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="콘텐츠 수" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">데이터가 부족합니다</p>
          )}
        </div>

        {/* 카테고리 분포 */}
        <div className="bg-white rounded-xl p-4 border-2 border-pink-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            카테고리 분포
          </h3>
          {stats.categories.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {stats.categories.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1">
                {stats.categories.slice(0, 6).map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-700 flex-1">{cat.name}</span>
                    <span className="font-semibold text-gray-800">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">데이터가 부족합니다</p>
          )}
        </div>
      </div>
    </div>
  );
}
