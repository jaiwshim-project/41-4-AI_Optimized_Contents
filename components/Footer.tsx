'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-pink-200 mt-12 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-900">AIO/GEO Optimizer</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              AI 검색엔진(AI Overview, Generative Engine)에 최적화된 콘텐츠를 분석하고 생성하는 올인원 도구입니다.
              Claude AI를 활용하여 콘텐츠의 AIO/GEO 점수를 분석하고, 최적화된 콘텐츠를 자동으로 생성합니다.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">서비스</h4>
            <ul className="space-y-2">
              <li><Link href="/analyze" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">콘텐츠 분석</Link></li>
              <li><Link href="/generate" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">콘텐츠 생성</Link></li>
              <li><Link href="/manual" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">사용자 매뉴얼</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">리소스</h4>
            <ul className="space-y-2">
              <li><a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">API Key 발급</a></li>
              <li><a href="https://docs.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Claude API 문서</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-pink-200 pt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            AIO/GEO Optimizer &mdash; AI 검색엔진 콘텐츠 최적화 도구
          </p>
          <p className="text-xs text-gray-400">
            Powered by Claude API
          </p>
        </div>
      </div>
    </footer>
  );
}
