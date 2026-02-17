'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  showApiKeyButton?: boolean;
  onToggleApiKey?: () => void;
  apiKeyOpen?: boolean;
}

const navItems = [
  { href: '/analyze', label: '콘텐츠 분석', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', activeStyle: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-300', idleStyle: 'text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-md' },
  { href: '/generate', label: '콘텐츠 생성', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', activeStyle: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-300', idleStyle: 'text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400 hover:shadow-md' },
  { href: '/keyword-analysis', label: '키워드 분석', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', activeStyle: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-300', idleStyle: 'text-cyan-700 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-md' },
  { href: '/series', label: '시리즈 기획', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', activeStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300', idleStyle: 'text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400 hover:shadow-md' },
];

export default function Header({ showApiKeyButton = false, onToggleApiKey, apiKeyOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-[#F0FFF4] border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900">AIO/GEO Optimizer</h1>
              <p className="text-[10px] text-gray-500">AI 검색엔진 콘텐츠 최적화 플랫폼</p>
            </div>
            <span className="sm:hidden text-sm font-bold text-gray-900">AIO/GEO</span>
          </Link>

          {/* 데스크톱 중앙 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1.5 bg-pink-50 rounded-xl p-1 border-2 border-pink-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border-2 ${
                    isActive
                      ? `${item.activeStyle} shadow-sm`
                      : `${item.idleStyle} hover:scale-[1.03]`
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 데스크톱 오른쪽 버튼 */}
          <div className="hidden md:flex items-center gap-1.5">
            {showApiKeyButton && (
              <button
                onClick={onToggleApiKey}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm border-2 hover:shadow-md hover:scale-[1.03] ${
                  apiKeyOpen
                    ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-violet-300 hover:border-violet-400'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                API Key
              </button>
            )}
            <Link
              href="/dashboard"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm border-2 hover:shadow-md hover:scale-[1.03] ${
                pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                  ? 'bg-gradient-to-r from-slate-700 to-gray-700 text-white border-slate-400'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              대시보드
            </Link>
            <Link
              href="/manual"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm border-2 border-sky-300 hover:shadow-md hover:scale-[1.03]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              매뉴얼
            </Link>
            <Link
              href="/introduction"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-medium rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-sm border-2 border-rose-300 hover:shadow-md hover:scale-[1.03]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              소개자료
            </Link>
            <Link
              href="/landing"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm border-2 hover:shadow-md hover:scale-[1.03] ${
                pathname === '/landing'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-300'
                  : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-violet-300 hover:from-violet-600 hover:to-indigo-600'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              홍보페이지
            </Link>

            {/* 로그인/로그아웃 */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 max-w-[120px] truncate">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border-2 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white border-2 border-emerald-300 hover:from-emerald-600 hover:to-green-700 transition-all"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 햄버거 + API Key */}
          <div className="flex md:hidden items-center gap-2">
            {showApiKeyButton && (
              <button
                onClick={onToggleApiKey}
                className={`p-2 rounded-lg border-2 transition-all ${
                  apiKeyOpen
                    ? 'bg-amber-500 text-white border-amber-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg border-2 border-green-200 bg-white text-gray-700 hover:bg-green-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-green-200 pt-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all border-2 ${
                    isActive
                      ? `${item.activeStyle} shadow-sm`
                      : `${item.idleStyle}`
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all border-2 ${
                pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                  ? 'bg-gradient-to-r from-slate-700 to-gray-700 text-white border-slate-400'
                  : 'bg-gray-50 text-gray-600 border-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              대시보드
            </Link>
            <Link
              href="/manual"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-2 border-sky-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              매뉴얼
            </Link>
            <Link
              href="/introduction"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white border-2 border-rose-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              소개자료
            </Link>
            <Link
              href="/landing"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-2 border-violet-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              홍보페이지
            </Link>

            {/* 모바일 로그인/로그아웃 */}
            <div className="border-t border-green-200 pt-2 mt-1">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</span>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 border-2 border-red-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium rounded-xl bg-gray-50 text-gray-700 border-2 border-gray-300"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white border-2 border-emerald-300"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
