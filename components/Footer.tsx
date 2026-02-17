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
              <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Gemini API Key 발급</a></li>
            </ul>
          </div>
        </div>
        {/* 연락처 & 법적 보호 */}
        <div className="border-t border-pink-200 pt-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-800">심재우 대표</span>
              <a href="tel:010-2397-5734" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                010-2397-5734
              </a>
              <a href="mailto:jaiwshim@gmail.com" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                jaiwshim@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-[11px] text-amber-800 font-medium">특허기술 및 저작권 등록으로 법적 보호를 받고 있습니다.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; 2026 AIO/GEO Optimizer &mdash; AI 검색엔진 콘텐츠 최적화 도구
          </p>
          <p className="text-xs text-gray-400">
            Powered by Claude API
          </p>
        </div>
      </div>
    </footer>
  );
}
