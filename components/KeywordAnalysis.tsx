'use client';

import type { KeywordAnalysis as KeywordAnalysisType } from '@/lib/types';

interface KeywordAnalysisProps {
  keywords: KeywordAnalysisType;
}

export default function KeywordAnalysis({ keywords }: KeywordAnalysisProps) {
  return (
    <div className="bg-teal-50 rounded-2xl shadow-sm border-2 border-teal-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">키워드 분석</h2>
      <p className="text-sm text-gray-500 mb-5">콘텐츠의 키워드 분포와 최적화 기회를 분석합니다</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주요 키워드 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">주요 키워드</h3>
          <div className="space-y-2">
            {keywords.primaryKeywords.map((kw, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${kw.prominence === 'high' ? 'bg-green-500' : kw.prominence === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-900">{kw.keyword}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{kw.count}회</span>
                  <span className={`font-medium ${kw.density >= 1 && kw.density <= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                    {kw.density}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 키워드 밀도 */}
          <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3">키워드 밀도</h3>
          <div className="space-y-2">
            {keywords.density.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{d.keyword}</span>
                  <span className={`text-xs font-medium ${d.optimal ? 'text-green-600' : 'text-orange-600'}`}>
                    {d.percentage}% {d.optimal ? '(적정)' : '(조정 필요)'}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${d.optimal ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min(100, d.percentage * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 관련 키워드 & 롱테일 */}
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">관련 키워드 제안</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.relatedKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">롱테일 키워드 기회</h3>
            <div className="space-y-2">
              {keywords.longTailOpportunities.map((kw, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-800">{kw}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">배치 최적화 제안</h3>
            <ul className="space-y-2">
              {keywords.placementSuggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
