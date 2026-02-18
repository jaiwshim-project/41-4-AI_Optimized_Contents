'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface StatsData {
  totalUsers: number;
  planCounts: { admin: number; free: number; pro: number; max: number };
  totalByFeature: { analyze: number; generate: number; keyword: number; series: number };
  thisMonthUsage: { analyze: number; generate: number; keyword: number; series: number };
  monthlyTrend: { month: string; analyze: number; generate: number; keyword: number; series: number; total: number }[];
  signupTrend: { month: string; count: number }[];
  activeToday: number;
  activeWeek: number;
  topUsers: { name: string; email: string; plan: string; total: number }[];
  currentMonth: string;
}

const FEATURE_LABELS: Record<string, string> = {
  analyze: '콘텐츠 분석',
  generate: '콘텐츠 생성',
  keyword: '키워드 분석',
  series: '시리즈 기획',
};

const FEATURE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  analyze: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
  generate: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  keyword: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
  series: { bg: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-500' },
};

const PLAN_STYLES: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-blue-100 text-blue-700',
  max: 'bg-violet-100 text-violet-700',
};

function formatMonth(month: string) {
  const [y, m] = month.split('-');
  return `${y}.${m}`;
}

export default function AdminStatsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === '96331425') {
      setAuthenticated(true);
      setAdminPassword(password);
      setPasswordError('');
      loadStats(password);
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다.');
    }
  };

  // 이미 인증된 상태에서 진입 시 (세션 유지용)
  useEffect(() => {
    const saved = sessionStorage.getItem('adminPw');
    if (saved === '96331425') {
      setAuthenticated(true);
      setAdminPassword(saved);
      loadStats(saved);
    }
  }, []);

  const loadStats = async (pw: string) => {
    setLoading(true);
    setError('');
    sessionStorage.setItem('adminPw', pw);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pw },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '조회 실패');
      }
      setStats(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">관리자 인증</h2>
              <p className="text-sm text-gray-500 mt-1">관리자 비밀번호를 입력하세요</p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-600 text-center font-medium">{passwordError}</p>
              )}
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md"
              >
                인증
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalUsageAll = stats ? Object.values(stats.totalByFeature).reduce((a, b) => a + b, 0) : 0;
  const thisMonthTotal = stats ? Object.values(stats.thisMonthUsage).reduce((a, b) => a + b, 0) : 0;
  const maxMonthlyTotal = stats ? Math.max(...stats.monthlyTrend.map(m => m.total), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              전체 통계 대시보드
            </h1>
            <p className="text-gray-500 mt-1">서비스 전체 사용량 및 회원 통계</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              회원 관리
            </Link>
            <button
              onClick={() => loadStats(adminPassword)}
              disabled={loading}
              className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {loading && !stats ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-8 h-8 animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            통계 로딩 중...
          </div>
        ) : stats && (
          <>
            {/* 1행: 핵심 지표 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">전체 회원</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {Object.entries(stats.planCounts).map(([plan, count]) => (
                    count > 0 && (
                      <span key={plan} className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${PLAN_STYLES[plan]}`}>
                        {plan === 'admin' ? '관리' : plan === 'free' ? '무료' : plan.toUpperCase()} {count}
                      </span>
                    )
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
                <p className="text-xs font-medium text-indigo-500 mb-1">누적 사용량</p>
                <p className="text-2xl font-bold text-indigo-600">{totalUsageAll.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">전체 기간 합계</p>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-sm">
                <p className="text-xs font-medium text-emerald-500 mb-1">이번 달 사용량</p>
                <p className="text-2xl font-bold text-emerald-600">{thisMonthTotal.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">{stats.currentMonth}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-amber-200 shadow-sm">
                <p className="text-xs font-medium text-amber-500 mb-1">활성 사용자</p>
                <p className="text-2xl font-bold text-amber-600">{stats.activeWeek}</p>
                <p className="text-[10px] text-gray-400 mt-1">오늘 {stats.activeToday}명 / 이번 주 {stats.activeWeek}명</p>
              </div>
            </div>

            {/* 2행: 기능별 사용량 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* 누적 사용량 */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">기능별 누적 사용량</h3>
                <div className="space-y-3">
                  {Object.entries(stats.totalByFeature).map(([feature, count]) => {
                    const maxCount = Math.max(...Object.values(stats.totalByFeature), 1);
                    const pct = (count / maxCount) * 100;
                    const colors = FEATURE_COLORS[feature];
                    return (
                      <div key={feature}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">{FEATURE_LABELS[feature]}</span>
                          <span className={`text-xs font-bold ${colors.text}`}>{count.toLocaleString()}회</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 이번 달 사용량 */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">이번 달 사용량 ({stats.currentMonth})</h3>
                <div className="space-y-3">
                  {Object.entries(stats.thisMonthUsage).map(([feature, count]) => {
                    const maxCount = Math.max(...Object.values(stats.thisMonthUsage), 1);
                    const pct = (count / maxCount) * 100;
                    const colors = FEATURE_COLORS[feature];
                    return (
                      <div key={feature}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">{FEATURE_LABELS[feature]}</span>
                          <span className={`text-xs font-bold ${colors.text}`}>{count.toLocaleString()}회</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3행: 월별 추이 차트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">월별 사용량 추이 (최근 6개월)</h3>
                <div className="flex items-end gap-2 h-40">
                  {stats.monthlyTrend.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-700">{m.total}</span>
                      <div className="w-full bg-gray-100 rounded-t-md overflow-hidden relative" style={{ height: '120px' }}>
                        <div className="absolute bottom-0 w-full flex flex-col">
                          {(['series', 'keyword', 'generate', 'analyze'] as const).map(f => {
                            const h = maxMonthlyTotal > 0 ? (m[f] / maxMonthlyTotal) * 120 : 0;
                            return <div key={f} className={`w-full ${FEATURE_COLORS[f].bar}`} style={{ height: `${h}px` }} />;
                          })}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">{formatMonth(m.month)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3 justify-center">
                  {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${FEATURE_COLORS[key].bar}`} />
                      <span className="text-[10px] text-gray-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">월별 가입자 추이 (최근 6개월)</h3>
                <div className="flex items-end gap-2 h-40">
                  {stats.signupTrend.map((m) => {
                    const maxSignup = Math.max(...stats.signupTrend.map(s => s.count), 1);
                    const h = (m.count / maxSignup) * 120;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-700">{m.count}</span>
                        <div className="w-full bg-gray-100 rounded-t-md overflow-hidden" style={{ height: '120px' }}>
                          <div className="w-full bg-indigo-400 rounded-t-md absolute bottom-0" style={{ height: `${h}px` }} />
                          <div className="relative w-full h-full flex items-end">
                            <div className="w-full bg-indigo-400 rounded-t-md" style={{ height: `${h}px` }} />
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500">{formatMonth(m.month)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4행: 상위 사용자 */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">상위 사용자 TOP 10 (누적 사용량 기준)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-center px-4 py-2 font-semibold text-gray-600 w-10">#</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">이름</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">이메일</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-600">등급</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-600">누적 사용량</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600 w-48"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">사용 기록이 없습니다.</td>
                      </tr>
                    ) : (
                      stats.topUsers.map((user, i) => {
                        const maxTotal = stats.topUsers[0]?.total || 1;
                        return (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="text-center px-4 py-2.5 font-bold text-gray-400">{i + 1}</td>
                            <td className="px-4 py-2.5 font-medium text-gray-800">{user.name}</td>
                            <td className="px-4 py-2.5 text-gray-500 text-xs">{user.email}</td>
                            <td className="text-center px-4 py-2.5">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${PLAN_STYLES[user.plan] || PLAN_STYLES.free}`}>
                                {user.plan === 'admin' ? '관리자' : user.plan === 'free' ? '무료' : user.plan.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-center px-4 py-2.5 font-bold text-indigo-600">{user.total.toLocaleString()}회</td>
                            <td className="px-4 py-2.5">
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(user.total / maxTotal) * 100}%` }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
