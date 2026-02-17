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
    title: '키워드 분석',
    description: '주요 키워드 밀도, 관련 키워드, 롱테일 기회, 배치 전략을 제안합니다.',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    color: 'from-teal-500 via-cyan-600 to-teal-600 border-teal-300',
    card: 'bg-teal-50 border-teal-200 hover:border-teal-400 hover:shadow-teal-100',
  },
  {
    title: 'AI 콘텐츠 생성',
    description: '블로그, 제품 설명, FAQ, How-to 등 8가지 유형의 AIO/GEO 최적화 콘텐츠를 자동 생성합니다.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    color: 'from-emerald-500 via-emerald-600 to-teal-600 border-emerald-300',
    card: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100',
  },
  {
    title: '개선 제안',
    description: '우선순위별 구체적인 최적화 액션 아이템과 Before/After 예시를 제공합니다.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    color: 'from-amber-500 via-orange-500 to-amber-600 border-amber-300',
    card: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-100',
  },
  {
    title: 'AI 최적화 변환',
    description: '분석 결과를 바탕으로 기존 콘텐츠를 AI 검색에 최적화된 버전으로 자동 변환합니다.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    color: 'from-rose-500 via-pink-500 to-rose-600 border-rose-300',
    card: 'bg-rose-50 border-rose-200 hover:border-rose-400 hover:shadow-rose-100',
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border-2 border-indigo-200 text-sm text-indigo-600 font-medium mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by Claude AI
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            AI 검색엔진에 최적화된<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              콘텐츠를 분석하고 생성하세요
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            AIO(AI Overview)와 GEO(Generative Engine Optimization) 관점에서
            콘텐츠를 종합 분석하고, AI 검색에 최적화된 고품질 콘텐츠를 자동으로 생성합니다.
          </p>

          <div className="flex items-center justify-center gap-4">
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
        </div>
      </section>

      {/* 주요 기능 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">주요 기능</h3>
          <p className="text-gray-500">AI 검색엔진 최적화를 위한 올인원 솔루션</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-2xl p-6 shadow-sm border-2 transition-all duration-200 group hover:shadow-md ${feature.card}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
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

      {/* API Key 입력 패널 */}
      <ApiKeyPanel visible={showApiKey} />

      {/* CTA 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center border-2 border-sky-300 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-3">지금 바로 시작하세요</h3>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
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
