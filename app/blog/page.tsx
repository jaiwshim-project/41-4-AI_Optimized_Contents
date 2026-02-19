'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TesterModal, { TesterFloatingButton } from '@/components/TesterModal';

const tabs = [
  {
    id: 'geo-aio',
    label: 'GEO-AIO',
    description: 'AI 검색 최적화 관련 콘텐츠',
    color: 'from-indigo-500 to-violet-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    posts: [
      { title: 'AI 검색 최적화(GEO)란 무엇인가?', date: '2026-02-19', tag: '가이드', summary: 'AI 검색 시대에 맞춘 새로운 최적화 전략의 핵심 개념을 알아봅니다.' },
      { title: 'ChatGPT, Gemini가 내 콘텐츠를 추천하게 만드는 법', date: '2026-02-19', tag: '전략', summary: 'AI 검색엔진이 콘텐츠를 선택하는 기준과 최적화 방법을 소개합니다.' },
      { title: 'GEO vs SEO: 무엇이 다르고 왜 중요한가', date: '2026-02-19', tag: '비교분석', summary: '기존 SEO와 AI 검색 최적화(GEO)의 차이점을 분석합니다.' },
    ],
  },
  {
    id: 'regenmed',
    label: '리젠메드컨설팅',
    description: '컨설팅 관련 콘텐츠',
    color: 'from-emerald-500 to-teal-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    posts: [
      { title: '의료기기 컨설팅, 어디서부터 시작해야 할까?', date: '2026-02-19', tag: '입문', summary: '의료기기 인허가 컨설팅의 기본 프로세스를 안내합니다.' },
      { title: '리젠메드컨설팅 서비스 소개', date: '2026-02-19', tag: '서비스', summary: '리젠메드컨설팅이 제공하는 주요 서비스를 소개합니다.' },
    ],
  },
  {
    id: 'brewery',
    label: '대전맥주장 수제맥주',
    description: '수제맥주 관련 콘텐츠',
    color: 'from-amber-500 to-orange-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    posts: [
      { title: '대전맥주장, 수제맥주의 새로운 경험', date: '2026-02-19', tag: '소개', summary: '대전맥주장만의 특별한 수제맥주 이야기를 전합니다.' },
      { title: '수제맥주 초보자를 위한 가이드', date: '2026-02-19', tag: '가이드', summary: '처음 수제맥주를 접하는 분들을 위한 기본 안내입니다.' },
    ],
  },
  {
    id: 'dental',
    label: '치과병원',
    description: '치과 관련 콘텐츠',
    color: 'from-sky-500 to-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    posts: [
      { title: '치과병원 온라인 마케팅 전략', date: '2026-02-19', tag: '마케팅', summary: '치과병원의 효과적인 온라인 마케팅 방법을 소개합니다.' },
      { title: '환자가 검색하는 치과 키워드 분석', date: '2026-02-19', tag: '분석', summary: '실제 환자들이 검색하는 치과 관련 키워드를 분석합니다.' },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  '가이드': 'bg-blue-100 text-blue-700',
  '전략': 'bg-purple-100 text-purple-700',
  '비교분석': 'bg-rose-100 text-rose-700',
  '입문': 'bg-green-100 text-green-700',
  '서비스': 'bg-emerald-100 text-emerald-700',
  '소개': 'bg-amber-100 text-amber-700',
  '마케팅': 'bg-sky-100 text-sky-700',
  '분석': 'bg-indigo-100 text-indigo-700',
};

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [showTesterModal, setShowTesterModal] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white px-6 sm:px-10 py-8 mb-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTR2LTJoNHptMC0xMHYyaC00di0yaDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">블로그 / 기사 / 방송</h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              GEO-AIO가 실제 운영하는 다양한 업종의 블로그, 언론 기사, 방송 콘텐츠를 한곳에서 확인하세요.
            </p>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
              AI 검색 최적화(GEO) 전략부터 의료기기 컨설팅, 수제맥주, 치과병원까지 — 각 업종별로 AI 검색엔진에 최적화된 콘텐츠가 어떻게 작성되고 활용되는지 실제 사례를 통해 확인할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 탭 설명 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{currentTab.label}</h2>
          <p className="text-sm text-gray-500 mt-1">{currentTab.description}</p>
        </div>

        {/* 포스트 목록 */}
        <div className="space-y-4">
          {currentTab.posts.map((post, idx) => (
            <article
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${TAG_COLORS[post.tag] || 'bg-gray-100 text-gray-600'}`}>
                      {post.tag}
                    </span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.summary}</p>
                </div>
                <div className={`shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${currentTab.color} flex items-center justify-center text-white opacity-60 group-hover:opacity-100 transition-opacity`}>
                  {currentTab.icon}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 콘텐츠 준비 중 안내 */}
        <div className="mt-8 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-sm text-gray-400 font-medium">더 많은 콘텐츠가 준비 중입니다</p>
          <p className="text-xs text-gray-300 mt-1">새로운 포스트가 곧 업데이트됩니다.</p>
        </div>
      </main>

      <Footer />
      <TesterFloatingButton onClick={() => setShowTesterModal(true)} />
      <TesterModal show={showTesterModal} onClose={() => setShowTesterModal(false)} />
    </div>
  );
}
