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
  { href: '/pricing', label: '요금', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', activeStyle: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-300', idleStyle: 'text-rose-700 border-rose-300 hover:bg-rose-50 hover:border-rose-400 hover:shadow-md' },
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
          <nav className="hidden md:flex items-center gap-1.5">
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
            {/* 로그인/로그아웃 */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 max-w-[120px] truncate">{user.email}</span>
                <Link
                  href="/change-password"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 border-2 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </Link>
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

            {/* 모바일 로그인/로그아웃 */}
            <div className="border-t border-green-200 pt-2 mt-1">
              {user ? (
                <div className="px-4 py-2.5 space-y-2">
                  <span className="text-xs text-gray-500 truncate block">{user.email}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/change-password"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-50 text-gray-600 border-2 border-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      비밀번호 변경
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 border-2 border-red-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
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
