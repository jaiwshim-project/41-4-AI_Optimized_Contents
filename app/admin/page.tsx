'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getUserPlan } from '@/lib/usage';

interface UserData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  plan: string;
  plan_expires_at: string | null;
  usage: {
    analyze: number;
    generate: number;
    keyword: number;
    series: number;
  };
  totalUsage: {
    analyze: number;
    generate: number;
    keyword: number;
    series: number;
  };
}

const PLAN_OPTIONS = [
  { value: 'admin', label: '관리자', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'free', label: '무료', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'tester', label: '테스터', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'pro', label: '프로', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'max', label: '맥스', color: 'bg-violet-100 text-violet-700 border-violet-300' },
];

function getPlanBadge(plan: string) {
  const opt = PLAN_OPTIONS.find(o => o.value === plan);
  return opt || { value: plan, label: plan, color: 'bg-gray-100 text-gray-700 border-gray-300' };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getExpiryStatus(expiresAt: string | null) {
  if (!expiresAt) return { label: '-', color: 'text-gray-400', dot: 'bg-gray-300', dday: '' };
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: '만료됨', color: 'text-red-600', dot: 'bg-red-500', dday: `D+${Math.abs(diffDays)}` };
  if (diffDays <= 3) return { label: '3일 이내', color: 'text-orange-600', dot: 'bg-orange-500', dday: `D-${diffDays}` };
  if (diffDays <= 7) return { label: '7일 이내', color: 'text-yellow-600', dot: 'bg-yellow-500', dday: `D-${diffDays}` };
  return { label: '정상', color: 'text-green-600', dot: 'bg-green-500', dday: `D-${diffDays}` };
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'subscriptions'>('users');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const plan = await getUserPlan();
        if (plan === 'admin') {
          setAuthenticated(true);
          loadUsers();
        }
      } catch {
        // not logged in
      } finally {
        setAuthChecking(false);
      }
    };
    checkAdmin();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '조회 실패');
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: string) => {
    setUpdatingUser(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '변경 실패');
      }
      // 유료 플랜이면 만료일도 반영
      const newExpiresAt = (newPlan === 'pro' || newPlan === 'max')
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, plan: newPlan, plan_expires_at: newExpiresAt } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleNameChange = async (userId: string, newName: string) => {
    setUpdatingUser(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '변경 실패');
      }
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, name: newName } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setUpdatingUser(null);
      setEditingName(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRenew = async (userId: string) => {
    setUpdatingUser(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '갱신 실패');
      }
      const data = await res.json();
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, plan_expires_at: data.newExpiresAt } : u)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setUpdatingUser(null);
    }
  };

  const subscriptionAlerts = useMemo(() => {
    const now = new Date();
    const paidUsers = users.filter(u => ['pro', 'max'].includes(u.plan) && u.plan_expires_at);
    const expired = paidUsers.filter(u => new Date(u.plan_expires_at!) < now);
    const within3Days = paidUsers.filter(u => {
      const diff = Math.ceil((new Date(u.plan_expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    });
    const within7Days = paidUsers.filter(u => {
      const diff = Math.ceil((new Date(u.plan_expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 3 && diff <= 7;
    });
    return { expired, within3Days, within7Days };
  }, [users]);

  const alertCount = subscriptionAlerts.expired.length + subscriptionAlerts.within3Days.length;

  const subscriptionUsers = useMemo(() => {
    return users
      .filter(u => ['pro', 'max'].includes(u.plan))
      .sort((a, b) => {
        const aExp = a.plan_expires_at ? new Date(a.plan_expires_at).getTime() : Infinity;
        const bExp = b.plan_expires_at ? new Date(b.plan_expires_at).getTime() : Infinity;
        return aExp - bExp;
      });
  }, [users]);

  const planStats = {
    total: users.length,
    admin: users.filter(u => u.plan === 'admin').length,
    free: users.filter(u => u.plan === 'free').length,
    tester: users.filter(u => u.plan === 'tester').length,
    pro: users.filter(u => u.plan === 'pro').length,
    max: users.filter(u => u.plan === 'max').length,
  };

  // 인증 확인 중
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">관리자 권한 확인 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 권한 없음
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">접근 권한 없음</h2>
            <p className="text-sm text-gray-500 mt-2">관리자 계정으로 로그인해야 접근할 수 있습니다.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all">
              홈으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            관리자 대시보드
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-sm">회원 정보 조회 및 등급 관리</p>
            <Link
              href="/admin/stats"
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all"
            >
              전체 통계
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500">전체 회원</p>
            <p className="text-2xl font-bold text-gray-900">{planStats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
            <p className="text-xs font-medium text-red-500">관리자</p>
            <p className="text-2xl font-bold text-red-600">{planStats.admin}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500">무료</p>
            <p className="text-2xl font-bold text-gray-600">{planStats.free}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
            <p className="text-xs font-medium text-blue-500">프로</p>
            <p className="text-2xl font-bold text-blue-600">{planStats.pro}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-violet-200 shadow-sm">
            <p className="text-xs font-medium text-violet-500">맥스</p>
            <p className="text-2xl font-bold text-violet-600">{planStats.max}</p>
          </div>
        </div>

        {/* 탭 전환 */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'users' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            회원 관리
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all relative ${activeTab === 'subscriptions' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            구독 관리
            {alertCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'subscriptions' && (
          <>
            {/* 구독 알림 카드 */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <p className="text-xs font-medium text-red-600">만료됨</p>
                </div>
                <p className="text-2xl font-bold text-red-700">{subscriptionAlerts.expired.length}명</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <p className="text-xs font-medium text-orange-600">3일 이내</p>
                </div>
                <p className="text-2xl font-bold text-orange-700">{subscriptionAlerts.within3Days.length}명</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <p className="text-xs font-medium text-yellow-600">7일 이내</p>
                </div>
                <p className="text-2xl font-bold text-yellow-700">{subscriptionAlerts.within7Days.length}명</p>
              </div>
            </div>

            {/* 구독 사용자 테이블 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">이름</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">이메일</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">등급</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">만료일</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">상태</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">D-day</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">유료 구독 사용자가 없습니다.</td>
                      </tr>
                    ) : (
                      subscriptionUsers.map((user) => {
                        const badge = getPlanBadge(user.plan);
                        const status = getExpiryStatus(user.plan_expires_at);
                        return (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{user.name || <span className="text-gray-400 italic">이름 없음</span>}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                            <td className="text-center px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${badge.color}`}>{badge.label}</span>
                            </td>
                            <td className="text-center px-4 py-3 text-xs text-gray-600">
                              {user.plan_expires_at ? formatDate(user.plan_expires_at).split(' ')[0] : '-'}
                            </td>
                            <td className="text-center px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                {status.label}
                              </span>
                            </td>
                            <td className="text-center px-4 py-3">
                              <span className={`text-xs font-bold ${status.color}`}>{status.dday}</span>
                            </td>
                            <td className="text-center px-4 py-3">
                              <button
                                onClick={() => handleRenew(user.id)}
                                disabled={updatingUser === user.id}
                                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all disabled:opacity-50"
                              >
                                {updatingUser === user.id ? '처리중...' : '30일 연장'}
                              </button>
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

        {activeTab === 'users' && (<>
        {/* 검색 + 새로고침 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름 또는 이메일로 검색..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => loadUsers()}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* 회원 목록 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">이름</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">이메일</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">등급</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">등급 변경</th>
                  <th className="text-center px-2 py-3 font-semibold text-gray-700">
                    <div>분석</div>
                    <div className="text-[10px] font-normal text-gray-400">누적/이번달</div>
                  </th>
                  <th className="text-center px-2 py-3 font-semibold text-gray-700">
                    <div>생성</div>
                    <div className="text-[10px] font-normal text-gray-400">누적/이번달</div>
                  </th>
                  <th className="text-center px-2 py-3 font-semibold text-gray-700">
                    <div>키워드</div>
                    <div className="text-[10px] font-normal text-gray-400">누적/이번달</div>
                  </th>
                  <th className="text-center px-2 py-3 font-semibold text-gray-700">
                    <div>시리즈</div>
                    <div className="text-[10px] font-normal text-gray-400">누적/이번달</div>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">가입일</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">최근 로그인</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-400">
                      <svg className="w-6 h-6 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      회원 목록 로딩 중...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-400">
                      {searchTerm ? '검색 결과가 없습니다.' : '회원이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const badge = getPlanBadge(user.plan);
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          {editingName === user.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleNameChange(user.id, editNameValue);
                                  if (e.key === 'Escape') setEditingName(null);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                autoFocus
                              />
                              <button
                                onClick={() => handleNameChange(user.id, editNameValue)}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setEditingName(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span
                              className="font-medium text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                              onClick={() => { setEditingName(user.id); setEditNameValue(user.name || ''); }}
                              title="클릭하여 이름 수정"
                            >
                              {user.name || <span className="text-gray-400 italic">이름 없음</span>}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-600 text-xs">{user.email}</span>
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3">
                          <select
                            value={user.plan}
                            onChange={(e) => handlePlanChange(user.id, e.target.value)}
                            disabled={updatingUser === user.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${
                              updatingUser === user.id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-indigo-300'
                            }`}
                          >
                            {PLAN_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        {(['analyze', 'generate', 'keyword', 'series'] as const).map(feature => {
                          const total = user.totalUsage?.[feature] || 0;
                          const monthly = user.usage[feature] || 0;
                          return (
                            <td key={feature} className="text-center px-2 py-2.5">
                              <div className="inline-flex flex-col items-center gap-0.5 min-w-[40px]">
                                <span className={`text-sm font-bold tabular-nums ${total > 0 ? 'text-gray-900' : 'text-gray-300'}`}>{total}</span>
                                <span className={`text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${monthly > 0 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}>{monthly}</span>
                              </div>
                            </td>
                          );
                        })}
                        <td className="text-center px-4 py-3 text-gray-500 text-xs">{formatDate(user.created_at)}</td>
                        <td className="text-center px-4 py-3 text-gray-500 text-xs">{formatDate(user.last_sign_in_at)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>)}
      </main>
      <Footer />
    </div>
  );
}
