'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiKeyPanel from '@/components/ApiKeyPanel';

const features = [
  {
    title: 'AIO 점수 분석',
    description: 'AI Overview 노출 확률, 구조화된 답변 적합성, 명확성, 인용 가능성을 종합 평가합니다.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'from-blue-500 via-blue-600 to-indigo-600 border-blue-300',
    card: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
  },
  {
    title: 'GEO 최적화',
    description: 'AI 검색엔진 친화도, E-E-A-T 신호, 구조화 데이터, 의미적 완성도를 분석합니다.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    color: 'from-purple-500 via-violet-600 to-purple-600 border-purple-300',
    card: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:shadow-purple-100',
  },
  {
    title: 'AI 최적화 변환',
    description: '분석 결과를 바탕으로 기존 콘텐츠를 AI 검색에 최적화된 버전으로 자동 변환합니다.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    color: 'from-rose-500 via-pink-500 to-rose-600 border-rose-300',
    card: 'bg-rose-50 border-rose-200 hover:border-rose-400 hover:shadow-rose-100',
  },
  {
    title: 'AI 콘텐츠 생성',
    description: '블로그, 제품 설명, FAQ, How-to 등 8가지 유형의 AIO/GEO 최적화 콘텐츠를 자동 생성합니다.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    color: 'from-emerald-500 via-emerald-600 to-teal-600 border-emerald-300',
    card: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100',
  },
  {
    title: 'A/B 버전 생성',
    description: '전문적, 친근한, 설득적 3가지 톤으로 동시 생성하여 최적의 콘텐츠를 선택할 수 있습니다.',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'from-amber-500 via-orange-500 to-amber-600 border-amber-300',
    card: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-100',
  },
  {
    title: 'SNS 채널별 변환',
    description: '생성된 콘텐츠를 인스타그램, 링크드인, 네이버 블로그, 카드뉴스 등으로 자동 변환합니다.',
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    color: 'from-pink-500 via-pink-600 to-rose-600 border-pink-300',
    card: 'bg-pink-50 border-pink-200 hover:border-pink-400 hover:shadow-pink-100',
  },
  {
    title: '키워드 경쟁 분석',
    description: '타겟 키워드의 경쟁 난이도, 검색 의도, AI 인용 핵심 요소, 차별화 전략을 분석합니다.',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    color: 'from-teal-500 via-cyan-600 to-teal-600 border-teal-300',
    card: 'bg-teal-50 border-teal-200 hover:border-teal-400 hover:shadow-teal-100',
  },
  {
    title: '콘텐츠 시리즈 기획',
    description: '하나의 주제로 3~12편의 연재 시리즈를 자동 기획하여 체계적인 콘텐츠 전략을 수립합니다.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'from-violet-500 via-violet-600 to-indigo-600 border-violet-300',
    card: 'bg-violet-50 border-violet-200 hover:border-violet-400 hover:shadow-violet-100',
  },
  {
    title: '대시보드 통계',
    description: '생성/분석 이력을 시각화된 통계와 차트로 확인하고 월별 트렌드를 파악합니다.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'from-sky-500 via-sky-600 to-blue-600 border-sky-300',
    card: 'bg-sky-50 border-sky-200 hover:border-sky-400 hover:shadow-sky-100',
  },
];

export default function LandingPage() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showApiKeyButton
        onToggleApiKey={() => setShowApiKey(!showApiKey)}
        apiKeyOpen={showApiKey}
      />

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border-2 border-indigo-200 text-sm text-indigo-600 font-medium mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by AI
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            AI 검색엔진에 최적화된<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              콘텐츠를 분석하고 생성하세요
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            AIO(AI Overview)와 GEO(Generative Engine Optimization) 관점에서
            콘텐츠를 종합 분석하고, AI 검색에 최적화된 고품질 콘텐츠를 자동으로 생성합니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 border-2 border-sky-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              콘텐츠 분석 시작
            </Link>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl hover:bg-gray-50 transition-all shadow-lg shadow-gray-100 border-2 border-violet-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              콘텐츠 생성하기
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link
              href="/landing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all shadow-md border-2 border-violet-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              홍보페이지
            </Link>
            <Link
              href="/introduction"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-md border-2 border-rose-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              소개자료
            </Link>
            <Link
              href="/manual"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md border-2 border-sky-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              매뉴얼
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-600 to-gray-700 text-white text-sm font-semibold rounded-xl hover:from-slate-700 hover:to-gray-800 transition-all shadow-md border-2 border-slate-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              대시보드
            </Link>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md border-2 border-amber-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              API 키
            </button>
          </div>
        </div>
      </section>

      {/* PDF 자료 섹션 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-md overflow-hidden">
          <div className="aspect-[4/3] w-full">
            <embed
              src="/ai-search-engine.pdf"
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">AI 검색 엔진의 선택</p>
            <a
              href="/ai-search-engine.pdf"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF 다운로드
            </a>
          </div>
        </div>
      </section>

      {/* 주요 기능 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">주요 기능</h3>
          <p className="text-gray-500">AI 검색엔진 최적화를 위한 올인원 솔루션</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-2xl p-5 shadow-sm border-2 transition-all duration-200 group hover:shadow-md ${feature.card}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 콘텐츠 분석 프로세스 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">콘텐츠 분석 &rarr; AI 최적화 변환</h3>
          <p className="text-gray-500">내 콘텐츠를 입력하면, AI가 분석하고 최적화된 버전까지 자동으로 제공합니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="relative bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-3">1</div>
            <h4 className="text-base font-bold text-gray-900 mb-2">콘텐츠 입력</h4>
            <p className="text-sm text-gray-600">기존에 작성한 콘텐츠를 입력하고 타겟 키워드를 설정합니다.</p>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-3">2</div>
            <h4 className="text-base font-bold text-gray-900 mb-2">종합 분석</h4>
            <p className="text-sm text-gray-600">AIO/GEO 점수, E-E-A-T 평가, 키워드 밀도, 구조화 수준을 종합 분석합니다.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">AIO 점수</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-md">GEO 점수</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-md">E-E-A-T</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-md">키워드</span>
            </div>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white rounded-xl p-5 border-2 border-amber-200 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-3">3</div>
            <h4 className="text-base font-bold text-gray-900 mb-2">개선 제안</h4>
            <p className="text-sm text-gray-600">우선순위별 구체적인 최적화 액션 아이템과 Before/After 예시를 제공합니다.</p>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 border-2 border-rose-300 shadow-sm ring-2 ring-rose-100">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-3">4</div>
            <h4 className="text-base font-bold text-gray-900 mb-2">AI 최적화 변환</h4>
            <p className="text-sm text-gray-600">분석 결과를 바탕으로 AI가 최적화된 버전의 콘텐츠를 자동 생성합니다.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded-md">최적화 콘텐츠</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-md">변경사항 요약</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-md">예상 점수</span>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-5 border-2 border-indigo-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h4 className="text-base font-bold text-indigo-900 mb-2">콘텐츠 생성도 한 번에</h4>
              <p className="text-sm text-gray-700">
                기존 콘텐츠가 없어도 괜찮습니다. 주제와 키워드만 입력하면 처음부터 AIO/GEO 최적화된 콘텐츠를 자동 생성하고,
                A/B 버전 비교, SNS 채널별 변환, 인포그래픽 이미지 생성까지 한 번에 제공합니다.
              </p>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md border-2 border-indigo-300 shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              콘텐츠 생성하기
            </Link>
          </div>
        </div>
      </section>

      {/* API Key 입력 패널 */}
      <ApiKeyPanel visible={showApiKey} />

      {/* CTA 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-center border-2 border-sky-300 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-3">지금 바로 시작하세요</h3>
          <p className="text-blue-100 mb-5 max-w-lg mx-auto">
            콘텐츠를 입력하면 즉시 AIO/GEO 분석 결과와 구체적인 개선 방안을 확인할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-blue-50 transition-all border-2 border-sky-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              콘텐츠 분석
            </Link>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-all border-2 border-indigo-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              콘텐츠 생성
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
