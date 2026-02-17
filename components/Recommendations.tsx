'use client';

import type { Recommendation } from '@/lib/types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: { label: '높음', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100' },
  medium: { label: '중간', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100' },
  low: { label: '낮음', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100' },
};

const categoryLabels: Record<string, string> = {
  aio: 'AIO', geo: 'GEO', keyword: '키워드', structure: '구조', content: '콘텐츠',
};

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const sorted = [...recommendations].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="bg-amber-50 rounded-2xl shadow-sm border-2 border-amber-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">개선 제안</h2>
      <p className="text-sm text-gray-500 mb-5">우선순위별 구체적인 최적화 액션 아이템입니다</p>

      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">모든 항목이 잘 최적화되어 있습니다!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((rec) => {
            const pConfig = priorityConfig[rec.priority];
            return (
              <div key={rec.id} className={`border ${pConfig.border} rounded-xl p-4 ${pConfig.bg}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pConfig.badge} ${pConfig.text}`}>
                      우선순위: {pConfig.label}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {categoryLabels[rec.category] || rec.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                {rec.before && rec.after && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                      <p className="text-xs font-medium text-red-500 mb-1">Before</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{rec.before}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                      <p className="text-xs font-medium text-green-500 mb-1">After</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{rec.after}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs text-indigo-600 font-medium">{rec.expectedImpact}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
