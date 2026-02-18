'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const handleLogin = () => {
    if (password === '96331425') {
      setAuthenticated(true);
      setAdminPassword(password);
      setPasswordError('');
      loadUsers(password);
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다.');
    }
  };

  const loadUsers = async (pw: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-password': pw },
      });
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '변경 실패');
      }
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, plan: newPlan } : u))
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
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

  const planStats = {
    total: users.length,
    admin: users.filter(u => u.plan === 'admin').length,
    free: users.filter(u => u.plan === 'free').length,
    pro: users.filter(u => u.plan === 'pro').length,
    max: users.filter(u => u.plan === 'max').length,
  };

  // 비밀번호 입력 화면
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
          <p className="text-gray-500 mt-1">회원 정보 조회 및 등급 관리</p>
          </div>
          <Link
            href="/admin/stats"
            className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all"
          >
            전체 통계
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500">전체 회원</p>
            <p className="text-2xl font-bold text-gray-900">{planStats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-sm">
            <p className="text-xs font-medium text-red-500">관리자</p>
            <p className="text-2xl font-bold text-red-600">{planStats.admin}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500">무료</p>
            <p className="text-2xl font-bold text-gray-600">{planStats.free}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm">
            <p className="text-xs font-medium text-blue-500">프로</p>
            <p className="text-2xl font-bold text-blue-600">{planStats.pro}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-violet-200 shadow-sm">
            <p className="text-xs font-medium text-violet-500">맥스</p>
            <p className="text-2xl font-bold text-violet-600">{planStats.max}</p>
          </div>
        </div>

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
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => loadUsers(adminPassword)}
            disabled={loading}
            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* 회원 목록 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
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
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${
                              updatingUser === user.id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-indigo-300'
                            }`}
                          >
                            {PLAN_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        {(['analyze', 'generate', 'keyword', 'series'] as const).map(feature => (
                          <td key={feature} className="text-center px-2 py-3">
                            <div className="text-gray-800 font-medium text-xs">{user.totalUsage?.[feature] || 0}</div>
                            <div className="text-[10px] text-indigo-500">{user.usage[feature] || 0}</div>
                          </td>
                        ))}
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
      </main>
      <Footer />
    </div>
  );
}
