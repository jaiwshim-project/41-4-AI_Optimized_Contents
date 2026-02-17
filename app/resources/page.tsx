'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tabs = [
  { id: 'search-engine', label: 'AI 검색 엔진의 선택', image: '/ai-search-engine.png', pdf: '/ai-search-engine.pdf' },
  { id: 'search-victory', label: 'AI 검색 시대의 승리', image: '/ai-search-victory.png', pdf: '/ai-search-victory.pdf' },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">자료실</h2>
          <p className="text-sm text-gray-500">AIO/GEO 최적화에 도움이 되는 자료를 확인하세요</p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 이미지 뷰어 */}
        <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-md overflow-hidden">
          <img
            key={active.id}
            src={active.image}
            alt={active.label}
            className="w-full"
          />
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{active.label}</p>
            <a
              href={active.pdf}
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
      </main>
      <Footer />
    </div>
  );
}
